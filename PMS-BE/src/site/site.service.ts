import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSiteContentDto, UpdateSiteSettingsDto } from './dto/site-content.dto';

const defaultSiteSettings = {
  resortName: 'Paraiso sa gubat',
  currency: 'USD',
  timezone: 'Asia/Manila',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  publicTheme: 'lagoon',
  notifications: true,
  autoConfirmations: true,
};

const defaultSiteContent = {
  name: 'Paraiso sa gubat',
  logoUrl: '',
  location: 'Tondol, Anda, Pangasinan',
  phone: '+63 917 500 0123',
  email: 'hello@paraisosagubat.com',
  tagline: 'Rooms, experiences, and channel bookings in one control center.',
  homeEyebrow: 'Tondol, Anda, Pangasinan',
  homeHeadline: 'Escape to Paraiso sa gubat',
  homeCopy:
    'Beachfront villas, curated experiences, and direct online booking from one resort website.',
  heroImageUrl: '',
  experiencesEyebrow: 'Experiences',
  experiencesHeadline: 'Curated activities for every stay',
  experiencesCopy: 'Surface scheduled programs from the same resort system visitors book from.',
  bookingEyebrow: 'Direct Booking',
  bookingHeadline: 'Search dates and choose your stay',
  bookingCopy:
    'This booking page is ready to connect to your real availability, pricing, and payment backend.',
  footerAbout:
    'Paraiso sa gubat is a coastal stay in Tondol, Anda, Pangasinan, offering comfortable rooms, local experiences, and direct booking for guests planning their beach getaway.',
  footerCopyright:
    '© 2026 Paraiso sa gubat. Beach stays and direct bookings in Tondol, Anda, Pangasinan.',
};

@Injectable()
export class SiteService {
  private siteSchemaReady?: Promise<void>;

  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    return this.ensureSettings();
  }

  async updateSettings(dto: UpdateSiteSettingsDto) {
    const settings = await this.ensureSettings();

    return this.prisma.siteSettings.update({
      where: { id: settings.id },
      data: dto,
    });
  }

  async getContent() {
    return this.ensureContent();
  }

  async updateContent(dto: UpdateSiteContentDto) {
    const content = await this.ensureContent();

    return this.prisma.siteContent.update({
      where: { id: content.id },
      data: dto,
    });
  }

  async getPublicData() {
    const [content, settings, rooms, programs, socialMedia] = await Promise.all([
      this.ensureContent(),
      this.ensureSettings(),
      this.prisma.room.findMany({ orderBy: { createdAt: 'desc' } }),
      this.prisma.program.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.socialAccount.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    return {
      resort: {
        name: content.name,
        location: content.location,
        phone: content.phone,
        email: content.email,
        tagline: content.tagline,
      },
      siteContent: content,
      settings,
      rooms,
      programs,
      socialMedia,
      guests: [],
      reservations: [],
      payments: [],
      posts: [],
      integrations: [],
      files: [],
    };
  }

  async getDashboardData() {
    const [publicData, guests, reservations, payments, posts, integrations, files] =
      await Promise.all([
        this.getPublicData(),
        this.prisma.guest.findMany({ orderBy: { createdAt: 'desc' } }),
        this.prisma.reservation.findMany({ orderBy: { createdAt: 'desc' } }),
        this.prisma.paymentRecord.findMany({ orderBy: { createdAt: 'desc' } }),
        this.prisma.marketingPost.findMany({ orderBy: { createdAt: 'desc' } }),
        this.prisma.integration.findMany({ orderBy: { createdAt: 'desc' } }),
        this.prisma.fileRecord.findMany({ orderBy: { createdAt: 'desc' } }),
      ]);

    return {
      ...publicData,
      guests,
      reservations,
      payments,
      posts,
      integrations,
      files,
    };
  }

  private async ensureSettings() {
    await this.ensureSiteSchemaCompatibility();

    const existing = await this.prisma.siteSettings.findFirst();

    if (existing) {
      return existing;
    }

    return this.prisma.siteSettings.create({
      data: defaultSiteSettings,
    });
  }

  private async ensureContent() {
    await this.ensureSiteSchemaCompatibility();

    const existing = await this.prisma.siteContent.findFirst();

    if (existing) {
      return existing;
    }

    return this.prisma.siteContent.create({
      data: defaultSiteContent,
    });
  }

  private async ensureSiteSchemaCompatibility() {
    if (!this.siteSchemaReady) {
      this.siteSchemaReady = this.applySiteSchemaCompatibility();
    }

    return this.siteSchemaReady;
  }

  private async applySiteSchemaCompatibility() {
    await this.prisma.$executeRawUnsafe(`
      ALTER TABLE "SiteSettings"
      ADD COLUMN IF NOT EXISTS "publicTheme" TEXT NOT NULL DEFAULT 'lagoon';
    `);

    await this.prisma.$executeRawUnsafe(`
      ALTER TABLE "SiteContent"
      ADD COLUMN IF NOT EXISTS "logoUrl" TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS "heroImageUrl" TEXT NOT NULL DEFAULT '';
    `);

    await this.prisma.$executeRawUnsafe(`
      ALTER TABLE "Program"
      ADD COLUMN IF NOT EXISTS "imageUrl" TEXT NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
    `);
  }
}
