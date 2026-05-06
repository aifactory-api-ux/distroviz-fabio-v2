import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { EventPublisher } from './event.publisher';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://distroviz:distrovizpass@localhost:25432/distroviz',
      entities: [Order],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrderService, EventPublisher],
})
export class AppModule {}