import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  readonly stripe: Stripe | null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = secretKey
      ? new Stripe(secretKey, { apiVersion: '2025-08-27.basil' })
      : null;
  }

  findAll() {
    return this.prisma.paymentRecord.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreatePaymentDto) {
    return this.prisma.paymentRecord.create({
      data: {
        guest: dto.guest.trim(),
        reservation: dto.reservation.trim(),
        amount: dto.amount,
        method: dto.method.trim(),
        source: dto.source.trim(),
        status: dto.status?.trim() || 'Paid',
        paidDate: dto.paidDate?.trim() || new Date().toISOString().slice(0, 10),
      },
    });
  }

  async update(id: string, dto: UpdatePaymentDto) {
    await this.ensureExists(id);

    return this.prisma.paymentRecord.update({
      where: { id },
      data: {
        ...(dto.guest !== undefined ? { guest: dto.guest.trim() } : {}),
        ...(dto.reservation !== undefined ? { reservation: dto.reservation.trim() } : {}),
        ...(dto.amount !== undefined ? { amount: dto.amount } : {}),
        ...(dto.method !== undefined ? { method: dto.method.trim() } : {}),
        ...(dto.source !== undefined ? { source: dto.source.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() || 'Paid' } : {}),
        ...(dto.paidDate !== undefined ? { paidDate: dto.paidDate.trim() } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.paymentRecord.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const payment = await this.prisma.paymentRecord.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
