import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @MinLength(1)
  guest!: string;

  @IsString()
  @MinLength(1)
  room!: string;

  @IsString()
  @MinLength(1)
  checkIn!: string;

  @IsString()
  @MinLength(1)
  checkOut!: string;

  @IsOptional()
  @IsString()
  source?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total!: number;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateReservationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  guest?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  room?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  checkIn?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  checkOut?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
