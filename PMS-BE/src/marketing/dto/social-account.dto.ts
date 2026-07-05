import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSocialAccountDto {
  @IsString()
  @MinLength(1)
  platform!: string;

  @IsString()
  @MinLength(1)
  handle!: string;

  @IsString()
  @MinLength(1)
  url!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsString()
  sync?: string;

  @IsOptional()
  @IsString()
  audience?: string;
}

export class UpdateSocialAccountDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  platform?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  handle?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  url?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  accountName?: string;

  @IsOptional()
  @IsString()
  sync?: string;

  @IsOptional()
  @IsString()
  audience?: string;
}
