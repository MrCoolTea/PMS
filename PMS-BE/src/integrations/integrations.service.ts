import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateIntegrationDto,
  UpdateIntegrationDto,
} from './dto/integration.dto';

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.integration.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateIntegrationDto) {
    return this.prisma.integration.create({
      data: {
        platform: dto.platform.trim(),
        category: dto.category.trim(),
        notes: dto.notes?.trim() || '',
        status: dto.status?.trim() || 'Pending Setup',
        sync: dto.sync?.trim() || 'Not configured',
      },
    });
  }

  async update(id: string, dto: UpdateIntegrationDto) {
    await this.ensureExists(id);

    return this.prisma.integration.update({
      where: { id },
      data: {
        ...(dto.platform !== undefined ? { platform: dto.platform.trim() } : {}),
        ...(dto.category !== undefined ? { category: dto.category.trim() } : {}),
        ...(dto.notes !== undefined ? { notes: dto.notes.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() || 'Pending Setup' } : {}),
        ...(dto.sync !== undefined ? { sync: dto.sync.trim() || 'Not configured' } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.integration.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const integration = await this.prisma.integration.findUnique({ where: { id } });

    if (!integration) {
      throw new NotFoundException('Integration not found');
    }

    return integration;
  }
}
