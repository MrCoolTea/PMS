import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  const allowedOrigins = [
    'http://localhost:3034',
    'http://127.0.0.1:3034',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
}

bootstrap();
