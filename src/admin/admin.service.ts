import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoanStatus } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  async getAllLoans() {
    return this.prisma.loan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });
  }

  async updateLoanStatus(loanId: string, status: LoanStatus) {
    // First, find the loan to ensure it exists
    const existingLoan = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!existingLoan) {
      throw new NotFoundException(`Loan with ID ${loanId} not found.`);
    }

    // Update the loan in the database
    const updatedLoan = await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        status,
        // Set the approvedAt timestamp only when the status is 'APPROVED'
        approvedAt: status === 'APPROVED' ? new Date() : existingLoan.approvedAt,
      },
    });

    // --- Dispatch the Notification Job ---
    // After the loan is successfully updated, add a job to the queue.
    const message = `Dear user, the status of your loan application #${loanId.substring(
      0,
      8,
    )} has been updated to ${status}.`;

    await this.notificationsQueue.add(
      'send-notification', // This is the name of the job
      {
        // This is the data payload the processor will receive
        userId: updatedLoan.userId,
        message: message,
      },
      {
        attempts: 3, // Retry up to 3 times if it fails
        backoff: {
          type: 'exponential',
          delay: 1000, // Wait 1s, then 2s, then 4s...
        },
      },
    );

    console.log(`Dispatched notification job for loan ${loanId}`);

    // Return the updated loan object to the controller
    return updatedLoan;
  }


  async getLoanById(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
        where: { id: loanId },
        include: {
            user: { select: { fullName: true, email: true } },
            repayments: { orderBy: { createdAt: 'desc' } },
        },
    });
    if (!loan) throw new NotFoundException('Loan not found');
    return loan;
}
}