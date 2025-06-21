import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma.service';

@Processor('scoring')
export class ScoringProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  // This method will process each job from the 'scoring' queue
  async process(job: Job<any, any, string>): Promise<any> {
    const { loanId, amountRequested } = job.data;
    console.log(`[Scoring Worker] Processing score for loan ${loanId}`);

    // --- The Rule-Based Mock Scoring Engine ---
    let score = 85;
    // Rule 1: Higher amounts have higher risk
    if (amountRequested > 50000) {
      score -= 15;
    } else if (amountRequested > 10000) {
      score -= 5;
    }
    // Rule 2: Add a bit of randomness to simulate a real-world score
    score -= Math.floor(Math.random() * 5);
    // -----------------------------------------

    // Update the loan in the database with the calculated score
    await this.prisma.loan.update({
      where: { id: loanId },
      data: {
        score: score,
        // Optional: you could auto-approve/reject here based on the score
        // status: score > 70 ? 'APPROVED' : 'PENDING',
      },
    });

    console.log(`[Scoring Worker] Loan ${loanId} scored with: ${score}`);
  }
}