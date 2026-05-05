import { IsNumber, IsNotEmpty } from 'class-validator';

export class AdjustStockDto {
  @IsNumber()
  @IsNotEmpty()
  adjustment: number; // Positive to add, negative to subtract
}
