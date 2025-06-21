import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoansModule } from './loans/loans.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { URL } from 'url'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisUrlString = configService.get<string>('REDIS_URL');
        if (!redisUrlString) {
          throw new Error('REDIS_URL environment variable is not defined!');
        }
        
        const redisUrl = new URL(redisUrlString);

        return {
          connection: {
            host: redisUrl.hostname,
            port: Number(redisUrl.port), 
            password: redisUrl.password,
          },
        };
      },
      inject: [ConfigService],
    }),
    // ------------------------------------------

    AuthModule,
    LoansModule,
    AdminModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}