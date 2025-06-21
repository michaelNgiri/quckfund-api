import { Controller, Post, Body, UseGuards, Request, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { LoansService } from './loans.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateLoanDto } from './dto/create-loan.dto';
import { CreateRepaymentDto } from './dto/create-repayment.dto';

@UseGuards(AuthGuard) // Protect all routes in this controller
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED) 
  applyForLoan(@Request() req, @Body() createLoanDto: CreateLoanDto) {
    const userId = req.user.sub; // Get userId from the JWT payload
    return this.loansService.createLoan(userId, createLoanDto);
  }

  @Get()
  getMyLoans(@Request() req) {
    const userId = req.user.sub;
    return this.loansService.findLoansByUserId(userId);
  }

  @Post(':id/repay')
  repayLoan(
    @Param('id') id: string,
    @Body() createRepaymentDto: CreateRepaymentDto, // Use the DTO for validation
  ) {
    return this.loansService.processRepayment(id, createRepaymentDto);
  }

}