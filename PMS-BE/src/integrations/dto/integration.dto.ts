import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateIntegrationDto {
  @IsString()
  @MinLength(1)
  platform!: string;

  @IsString()
  @MinLength(1)
  category!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sync?: string;
}

export class UpdateIntegrationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  platform?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  category?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  sync?: string;
}
