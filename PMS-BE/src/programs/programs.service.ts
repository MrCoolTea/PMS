import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto, UpdateProgramDto } from './dto/program.dto';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.program.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateProgramDto) {
    return this.prisma.program.create({
      data: {
        title: dto.title.trim(),
        schedule: dto.schedule.trim(),
        venue: dto.venue.trim(),
        host: dto.host.trim(),
        capacity: dto.capacity,
        bookings: dto.bookings ?? 0,
        status: dto.status?.trim() || 'Scheduled',
      },
    });
  }

  async update(id: string, dto: UpdateProgramDto) {
    await this.ensureExists(id);

    return this.prisma.program.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.schedule !== undefined ? { schedule: dto.schedule.trim() } : {}),
        ...(dto.venue !== undefined ? { venue: dto.venue.trim() } : {}),
        ...(dto.host !== undefined ? { host: dto.host.trim() } : {}),
        ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        ...(dto.bookings !== undefined ? { bookings: dto.bookings } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() || 'Scheduled' } : {}),
      },
    });
  }

  async remove(id: string) {
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
}
