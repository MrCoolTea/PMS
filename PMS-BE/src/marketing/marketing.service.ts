import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSocialAccountDto,
  UpdateSocialAccountDto,
} from './dto/social-account.dto';
import {
  CreateMarketingPostDto,
  UpdateMarketingPostDto,
} from './dto/post.dto';

@Injectable()
export class MarketingService {
  constructor(private readonly prisma: PrismaService) {}

  listSocialAccounts() {
    return this.prisma.socialAccount.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createSocialAccount(dto: CreateSocialAccountDto) {
    return this.prisma.socialAccount.create({
      data: {
        platform: dto.platform.trim(),
        handle: dto.handle.trim(),
        url: dto.url.trim(),
        status: dto.status?.trim() || 'Ready',
        accountName: dto.accountName?.trim() || dto.handle.trim(),
        sync: dto.sync?.trim() || 'Ready to publish',
        audience: dto.audience?.trim() || '',
      },
    });
  }

  async updateSocialAccount(id: string, dto: UpdateSocialAccountDto) {
    await this.ensureSocialAccount(id);

    return this.prisma.socialAccount.update({
      where: { id },
      data: {
        ...(dto.platform !== undefined ? { platform: dto.platform.trim() } : {}),
        ...(dto.handle !== undefined ? { handle: dto.handle.trim() } : {}),
        ...(dto.url !== undefined ? { url: dto.url.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() || 'Ready' } : {}),
        ...(dto.accountName !== undefined ? { accountName: dto.accountName.trim() } : {}),
        ...(dto.sync !== undefined ? { sync: dto.sync.trim() || 'Ready to publish' } : {}),
        ...(dto.audience !== undefined ? { audience: dto.audience.trim() } : {}),
      },
    });
  }

  async removeSocialAccount(id: string) {
    await this.ensureSocialAccount(id);
    await this.prisma.socialAccount.delete({ where: { id } });
    return { success: true };
  }

  listPosts() {
    return this.prisma.marketingPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  createPost(dto: CreateMarketingPostDto) {
    return this.prisma.marketingPost.create({
      data: {
        title: dto.title.trim(),
        caption: dto.caption.trim(),
        platforms: dto.platforms.length ? dto.platforms : ['Facebook'],
        mediaUrl: dto.mediaUrl?.trim() || '',
        publishAt: dto.publishAt?.trim() || '',
        status: dto.status?.trim() || (dto.publishAt ? 'Scheduled' : 'Draft'),
        cta: dto.cta?.trim() || '',
      },
    });
  }

  async updatePost(id: string, dto: UpdateMarketingPostDto) {
    await this.ensurePost(id);

    return this.prisma.marketingPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.caption !== undefined ? { caption: dto.caption.trim() } : {}),
        ...(dto.platforms !== undefined ? { platforms: dto.platforms } : {}),
        ...(dto.mediaUrl !== undefined ? { mediaUrl: dto.mediaUrl.trim() } : {}),
        ...(dto.publishAt !== undefined ? { publishAt: dto.publishAt.trim() } : {}),
        ...(dto.status !== undefined ? { status: dto.status.trim() || 'Draft' } : {}),
        ...(dto.cta !== undefined ? { cta: dto.cta.trim() } : {}),
      },
    });
  }

  async removePost(id: string) {
    await this.ensurePost(id);
    await this.prisma.marketingPost.delete({ where: { id } });
    return { success: true };
  }

  private async ensureSocialAccount(id: string) {
    const account = await this.prisma.socialAccount.findUnique({ where: { id } });

    if (!account) {
      throw new NotFoundException('Social account not found');
    }

    return account;
  }

  private async ensurePost(id: string) {
    const post = await this.prisma.marketingPost.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
}
