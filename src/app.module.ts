import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { LoansModule } from './loans/loans.module';
import { PrismaService } from './prisma.service';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({ // Configure BullMQ globally
      connection: {
        host: 'localhost', // Or Redis host
        port: 6379,
      },
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Time-to-live: 60 seconds
      limit: 60,  // Limit: 60 requests per ttl per IP
    }]),
    NotificationsModule,
    AuthModule,
    LoansModule,
    AdminModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}