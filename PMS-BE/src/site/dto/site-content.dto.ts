import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateSiteSettingsDto {
  @IsOptional()
  @IsString()
  resortName?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  checkInTime?: string;

  @IsOptional()
  @IsString()
  checkOutTime?: string;

  @IsOptional()
  @IsString()
  publicTheme?: string;

  @IsOptional()
  @IsBoolean()
  notifications?: boolean;

  @IsOptional()
  @IsBoolean()
  autoConfirmations?: boolean;
}

export class UpdateSiteContentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  homeEyebrow?: string;

  @IsOptional()
  @IsString()
  homeHeadline?: string;

  @IsOptional()
  @IsString()
  homeCopy?: string;

  @IsOptional()
  @IsString()
  heroImageUrl?: string;

  @IsOptional()
  @IsString()
  experiencesEyebrow?: string;

  @IsOptional()
  @IsString()
  experiencesHeadline?: string;

  @IsOptional()
  @IsString()
  experiencesCopy?: string;

  @IsOptional()
  @IsString()
  bookingEyebrow?: string;

  @IsOptional()
  @IsString()
  bookingHeadline?: string;

  @IsOptional()
  @IsString()
  bookingCopy?: string;

  @IsOptional()
  @IsString()
  footerAbout?: string;

  @IsOptional()
  @IsString()
  footerCopyright?: string;
}
