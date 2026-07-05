import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateReservationDto,
  UpdateReservationDto,
} from './dto/reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateReservationDto) {
    return this.prisma.reservation.create({
      data: {
        guest: dto.guest.trim(),
        room: dto.room.trim(),
        checkIn: dto.checkIn.trim(),
        checkOut: dto.checkOut.trim(),
        source: dto.source?.trim() || 'Direct Website',
        total: dto.total,
        status: dto.status?.trim() || 'Confirmed',
      },
    });
  }

  async update(id: string, dto: UpdateReservationDto) {
    await this.ensureExists(id);

    return this.prisma.reservation.update({
      where: { id },
      data: {
        ...(dto.guest !== undefined ? { guest: dto.guest.trim() } : {}),
        ...(dto.room !== undefined ? { room: dto.room.trim() } : {}),
        ...(dto.checkIn !== undefined ? { checkIn: dto.checkIn.trim() } : {}),
        ...(dto.checkOut !== undefined ? { checkOut: dto.checkOut.trim() } : {}),
        ...(dto.source !== undefined ? { source: dto.source.trim() || 'Direct Website' } : {}),
        ...(dto.total !== undefined ? { total: dto.total } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() || 'Confirmed' } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.reservation.delete({
      where: { id },
    });

    return { success: true };
  }

  private async ensureExists(id: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }
}
