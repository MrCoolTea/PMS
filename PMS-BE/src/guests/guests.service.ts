import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto, UpdateGuestDto } from './dto/guest.dto';

@Injectable()
export class GuestsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.guest.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateGuestDto) {
    return this.prisma.guest.create({
      data: {
        name: dto.name.trim(),
        phone: dto.phone?.trim() || '',
        email: dto.email?.trim() || '',
        nationality: dto.nationality?.trim() || '',
        notes: dto.notes?.trim() || '',
        vip: dto.vip?.trim() || 'Standard',
      },
    });
  }

  async update(id: string, dto: UpdateGuestDto) {
    await this.ensureExists(id);

    return this.prisma.guest.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.phone !== undefined ? { phone: dto.phone.trim() } : {}),
        ...(dto.email !== undefined ? { email: dto.email.trim() } : {}),
        ...(dto.nationality !== undefined ? { nationality: dto.nationality.trim() } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes.trim() } : {}),
        ...(dto.vip !== undefined ? { vip: dto.vip.trim() || 'Standard' } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.guest.delete({
      where: { id },
    });

    return { success: true };
  }

  private async ensureExists(id: string) {
    const guest = await this.prisma.guest.findUnique({
      where: { id },
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return guest;
  }
}
