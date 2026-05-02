import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateIndustryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  moduleIds?: string[];
}
