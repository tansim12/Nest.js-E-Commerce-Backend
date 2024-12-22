import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with credentials
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://e-commerce-next-a9.vercel.app',
    ], // Allow specific origins
    credentials: true, // Allow cookies to be sent
  });

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.use(cookieParser());

  await app.listen(port);
}
bootstrap();
