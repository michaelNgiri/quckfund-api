import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [AuthModule, BullModule.registerQueue({ name: 'notifications' })],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}