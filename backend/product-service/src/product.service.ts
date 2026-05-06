import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  private async seedProducts() {
    const count = await this.productRepository.count();
    if (count === 0) {
      const products = [
        { id: uuidv4(), name: 'Laptop Pro 15', description: 'High-performance laptop for professionals', sku: 'LAP-001' },
        { id: uuidv4(), name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', sku: 'MOU-001' },
        { id: uuidv4(), name: 'USB-C Hub', description: 'Multi-port USB-C hub', sku: 'HUB-001' },
        { id: uuidv4(), name: 'Monitor 27"', description: '4K UHD monitor', sku: 'MON-001' },
        { id: uuidv4(), name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard', sku: 'KBD-001' },
      ];
      await this.productRepository.save(products);
      console.log('Products seeded');
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { id } }) || null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { sku } }) || null;
  }
}