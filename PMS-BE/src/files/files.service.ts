import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileRecordDto, UpdateFileRecordDto } from './dto/file-record.dto';

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.fileRecord.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  create(dto: CreateFileRecordDto) {
    return this.prisma.fileRecord.create({
      data: {
        name: dto.name.trim(),
        area: dto.area.trim(),
        category: dto.category.trim(),
        updatedAt: dto.updatedAt?.trim() || new Date().toISOString().slice(0, 10),
      },
    });
  }

  async update(id: string, dto: UpdateFileRecordDto) {
    await this.ensureExists(id);

    return this.prisma.fileRecord.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
        ...(dto.area !== undefined ? { area: dto.area.trim() } : {}),
        ...(dto.category !== undefined ? { category: dto.category.trim() } : {}),
        ...(dto.updatedAt !== undefined ? { updatedAt: dto.updatedAt.trim() } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.fileRecord.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const file = await this.prisma.fileRecord.findUnique({ where: { id } });

    if (!file) {
      throw new NotFoundException('File record not found');
    }

    return file;
  }
}
