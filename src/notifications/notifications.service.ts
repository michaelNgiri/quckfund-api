import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from 'src/prisma.service';

@Processor('notifications')
export class NotificationsService extends WorkerHost {
  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing notification job: ${job.id}`);
    const { userId, message } = job.data;
    
    // In a real app, you would use a service like Twilio or AWS SES here.
    // For this challenge, we just log it to our database.
    await this.prisma.notificationLog.create({
        data: {
            userId,
            content: message,
            type: 'EMAIL' // Mocked type
        }
    });

    console.log(`Notification for user ${userId} logged.`);
  }
}