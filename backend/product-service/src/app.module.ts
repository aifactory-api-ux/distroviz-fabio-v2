import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://distroviz:distrovizpass@localhost:25432/distroviz',
      entities: [Product],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}