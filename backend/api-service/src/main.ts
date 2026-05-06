import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.enableCors();

  const port = process.env.API_PORT || 23001;
  await app.listen(port, '0.0.0.0');

  app.get('/health', (req, res) => {
    res.send('OK');
  });

  console.log(`API Service running on port ${port}`);
}

bootstrap();