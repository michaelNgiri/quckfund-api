import { IsEnum, IsNumber, Min } from 'class-validator';

// Define an enum to restrict the possible values
export enum PaymentMethod {
  CARD = 'CARD',
  VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
}

export class CreateRepaymentDto {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}