import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.enableCors();

  const port = process.env.PORT || 23003;
  await app.listen(port);
  console.log(`Inventory service running on port ${port}`);
}

bootstrap();