import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //  Get the port from the environment variables, with a fallback to 3001
  const port = configService.get<number>('PORT') || 3001;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:3000',
  });

  // await app.listen(port);
  await app.listen(port, '0.0.0.0');


  console.log(`🚀 Backend is running on: http://localhost:${port}`);
}
bootstrap();