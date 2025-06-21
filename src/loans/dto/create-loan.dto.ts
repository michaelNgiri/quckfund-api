import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @Min(100) 
  amountRequested: number;

  @IsString()
  @IsOptional()
  purpose?: string;
}