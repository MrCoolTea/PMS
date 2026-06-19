import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

type SafeUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role ?? Role.STAFF,
      },
    });

    return this.issueAuthTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueAuthTokens(user);
  }

  async refresh(refreshToken: string) {
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: {
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });

    for (const entry of storedTokens) {
      const matches = await bcrypt.compare(refreshToken, entry.tokenHash);
      if (matches) {
        await this.prisma.refreshToken.update({
          where: { id: entry.id },
          data: { revokedAt: new Date() },
        });

        return this.issueAuthTokens(entry.user);
      }
    }

    throw new UnauthorizedException('Invalid refresh token');
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toSafeUser(user);
  }

  private async issueAuthTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'change-me-refresh'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as never,
    });

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: await bcrypt.hash(refreshToken, 10),
        expiresAt: this.parseRefreshExpiry(),
        userId: user.id,
      },
    });

    return {
      user: this.toSafeUser(user),
      accessToken,
      refreshToken,
    };
  }

  private toSafeUser(user: User): SafeUser {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  private parseRefreshExpiry() {
    const expiry = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const now = new Date();

    if (expiry.endsWith('d')) {
      now.setDate(now.getDate() + Number(expiry.replace('d', '')));
      return now;
    }

    if (expiry.endsWith('h')) {
      now.setHours(now.getHours() + Number(expiry.replace('h', '')));
      return now;
    }

    now.setDate(now.getDate() + 7);
    return now;
  }
}
