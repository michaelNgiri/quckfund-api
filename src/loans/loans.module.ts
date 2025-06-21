import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { ScoringProcessor } from './scoring.processor'; 

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({
      name: 'scoring',
    }),
  ],
  controllers: [LoansController],
  providers: [LoansService, PrismaService, ScoringProcessor],
})
export class LoansModule {}