import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CreateRepaymentDto } from './dto/create-repayment.dto';

@Injectable()
export class LoansService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('scoring') private readonly scoringQueue: Queue,
  ) {}

  // Mock scoring engine
  private runMockScoring(amount: number): number {
    // A simple, predictable mock score.
    // For example, higher amounts get slightly lower scores.
    const baseScore = 80;
    const amountPenalty = Math.floor(amount / 1000); // 1 point penalty per 1000
    return Math.max(30, baseScore - amountPenalty); // Ensure score is not below 30
  }

  async createLoan(userId: string, createLoanDto: CreateLoanDto) {
    const { amountRequested, purpose } = createLoanDto;

    // Create the loan with a PENDING status and no score yet
    const newLoan = await this.prisma.loan.create({
      data: {
        amountRequested,
        purpose,
        status: 'PENDING',
        userId,
      },
    });

    // Dispatch a job to the scoring queue to process this loan asynchronously
    await this.scoringQueue.add('score-loan', {
      loanId: newLoan.id,
      amountRequested: newLoan.amountRequested,
    });

    console.log(`Dispatched scoring job for loan ${newLoan.id}`);
    
    // Return the newly created loan immediately. The score will be updated in the background.
    return newLoan;
  }

  async findLoansByUserId(userId: string) {
    return this.prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async processRepayment(loanId: string, repaymentDto: CreateRepaymentDto) {
    const { amount, paymentMethod } = repaymentDto;
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: { repayments: true },
    });

    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.status !== 'APPROVED') {
      throw new BadRequestException('Can only repay an approved loan.');
    }

    const totalRepaid = loan.repayments
      .filter(r => r.status === 'SUCCESSFUL')
      .reduce((sum, r) => sum + r.amount, 0);

    if (totalRepaid >= loan.amountRequested) {
      throw new BadRequestException('Loan has already been fully paid.');
    }

    // Simulate payment success
    await this.prisma.repayment.create({
        data: {
          loanId,
          amount,
          paymentMethod,
          status: 'SUCCESSFUL',
          transactionReference: `qf_repay_${Date.now()}`,
        },
      });
  

    // Check if the loan is now fully paid
    const newTotalRepaid = totalRepaid + amount;
    if (newTotalRepaid >= loan.amountRequested) {
      await this.prisma.loan.update({
        where: { id: loanId },
        data: { status: 'PAID' },
      });
    }

    return { message: 'Repayment successful' };
  }
}