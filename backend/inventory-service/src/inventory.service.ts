import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from './inventory.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InventoryService implements OnModuleInit {
  constructor(
    @InjectRepository(InventoryItem)
    private inventoryRepository: Repository<InventoryItem>,
  ) {}

  async onModuleInit() {
    await this.seedInventory();
  }

  private async seedInventory() {
    const count = await this.inventoryRepository.count();
    if (count === 0) {
      const items = [
        { id: uuidv4(), productId: uuidv4(), stock: 100 },
        { id: uuidv4(), productId: uuidv4(), stock: 50 },
        { id: uuidv4(), productId: uuidv4(), stock: 200 },
        { id: uuidv4(), productId: uuidv4(), stock: 75 },
        { id: uuidv4(), productId: uuidv4(), stock: 150 },
      ];
      await this.inventoryRepository.save(items);
      console.log('Inventory items seeded');
    }
  }

  async findByProductId(productId: string): Promise<InventoryItem | null> {
    return this.inventoryRepository.findOne({ where: { productId } }) || null;
  }

  async checkAvailability(productId: string, quantity: number): Promise<{ available: boolean; currentStock: number }> {
    const item = await this.findByProductId(productId);
    if (!item) {
      return { available: false, currentStock: 0 };
    }
    return {
      available: item.stock >= quantity,
      currentStock: item.stock,
    };
  }

  async updateStock(productId: string, stock: number): Promise<InventoryItem | null> {
    let item = await this.findByProductId(productId);
    if (!item) {
      item = this.inventoryRepository.create({
        id: uuidv4(),
        productId,
        stock,
      });
    } else {
      item.stock = stock;
    }
    return this.inventoryRepository.save(item);
  }
}