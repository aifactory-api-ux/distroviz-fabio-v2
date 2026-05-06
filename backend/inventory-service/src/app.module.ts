import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryItem } from './inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://distroviz:distrovizpass@localhost:25432/distroviz',
      entities: [InventoryItem],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([InventoryItem]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class AppModule {}