import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @MinLength(1)
  guest!: string;

  @IsString()
  @MinLength(1)
  reservation!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount!: number;

  @IsString()
  @MinLength(1)
  method!: string;

  @IsString()
  @MinLength(1)
  source!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  paidDate?: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  guest?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  reservation?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  @MinLength(1)
  method?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  source?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  paidDate?: string;
}
