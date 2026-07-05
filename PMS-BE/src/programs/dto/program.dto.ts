import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateProgramDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @MinLength(1)
  schedule!: string;

  @IsString()
  @MinLength(1)
  venue!: string;

  @IsString()
  @MinLength(1)
  host!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacity!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bookings?: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateProgramDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  schedule?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  venue?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  host?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bookings?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
