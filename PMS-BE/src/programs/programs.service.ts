import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto, UpdateProgramDto } from './dto/program.dto';

@Injectable()
export class ProgramsService {
  private programSchemaReady?: Promise<void>;

  constructor(private readonly prisma: PrismaService) {}

  private getStatusFromActiveState(isActive: boolean) {
    return isActive ? 'Active' : 'Inactive';
  }

  async findAll() {
    await this.ensureProgramSchemaCompatibility();

    return this.prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateProgramDto) {
    await this.ensureProgramSchemaCompatibility();

    return this.prisma.program.create({
      data: {
        title: dto.title.trim(),
        schedule: '',
        venue: dto.venue.trim(),
        host: dto.host.trim(),
        capacity: dto.capacity,
        bookings: dto.bookings ?? 0,
        imageUrl: dto.imageUrl?.trim() ?? '',
        isActive: dto.isActive ?? true,
        status: this.getStatusFromActiveState(dto.isActive ?? true),
      },
    });
  }

  async update(id: string, dto: UpdateProgramDto) {
    await this.ensureProgramSchemaCompatibility();
    await this.ensureExists(id);

    return this.prisma.program.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.venue !== undefined ? { venue: dto.venue.trim() } : {}),
        ...(dto.host !== undefined ? { host: dto.host.trim() } : {}),
        ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        ...(dto.bookings !== undefined ? { bookings: dto.bookings } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl.trim() } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
        ...(dto.isActive !== undefined
          ? { status: this.getStatusFromActiveState(dto.isActive) }
          : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureProgramSchemaCompatibility();
    await this.ensureExists(id);
    await this.prisma.program.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const program = await this.prisma.program.findUnique({ where: { id } });

    if (!program) {
      throw new NotFoundException('Program not found');
    }

    return program;
  }

  private async ensureProgramSchemaCompatibility() {
    if (!this.programSchemaReady) {
      this.programSchemaReady = this.prisma.$executeRawUnsafe(`
        ALTER TABLE "Program"
        ADD COLUMN IF NOT EXISTS "imageUrl" TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
      `).then(() => undefined);
    }

    return this.programSchemaReady;
  }
}
