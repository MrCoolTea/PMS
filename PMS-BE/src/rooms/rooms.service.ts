import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto, UpdateRoomDto } from './dto/room.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.room.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        name: dto.name.trim(),
        type: dto.type.trim(),
        capacity: dto.capacity,
        rate: dto.rate,
        floor: dto.floor.trim(),
        amenities: dto.amenities.trim(),
        image: dto.image?.trim() || null,
        status: dto.status?.trim() || 'Available',
      },
    });
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.ensureExists(id);

    return this.prisma.room.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.type !== undefined ? { type: dto.type.trim() } : {}),
        ...(dto.capacity !== undefined ? { capacity: dto.capacity } : {}),
        ...(dto.rate !== undefined ? { rate: dto.rate } : {}),
        ...(dto.floor !== undefined ? { floor: dto.floor.trim() } : {}),
        ...(dto.amenities !== undefined ? { amenities: dto.amenities.trim() } : {}),
        ...(dto.image !== undefined ? { image: dto.image.trim() || null } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.room.delete({
      where: { id },
    });

    return { success: true };
  }

  private async ensureExists(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}
