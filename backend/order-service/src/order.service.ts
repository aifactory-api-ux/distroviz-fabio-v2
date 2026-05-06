import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { v4 as uuidv4 } from 'uuid';
import { EventPublisher } from './event.publisher';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private eventPublisher: EventPublisher,
  ) {}

  async onModuleInit() {
    await this.seedSampleOrders();
  }

  private async seedSampleOrders() {
    const count = await this.orderRepository.count();
    if (count === 0) {
      const orders = [
        {
          id: uuidv4(),
          userId: uuidv4(),
          productId: uuidv4(),
          quantity: 2,
          status: 'PENDING' as const,
        },
        {
          id: uuidv4(),
          userId: uuidv4(),
          productId: uuidv4(),
          quantity: 1,
          status: 'CONFIRMED' as const,
        },
        {
          id: uuidv4(),
          userId: uuidv4(),
          productId: uuidv4(),
          quantity: 5,
          status: 'DISPATCHED' as const,
        },
      ];
      await this.orderRepository.save(orders);
      console.log('Sample orders seeded');
    }
  }

  async createOrder(data: { userId: string; productId: string; quantity: number }): Promise<Order> {
    const order = this.orderRepository.create({
      id: uuidv4(),
      ...data,
      status: 'PENDING',
    });
    const savedOrder = await this.orderRepository.save(order);
    await this.eventPublisher.publishOrderCreated(savedOrder);
    return savedOrder;
  }

  async findAll(userId?: string): Promise<Order[]> {
    if (userId) {
      return this.orderRepository.find({ where: { userId } });
    }
    return this.orderRepository.find();
  }

  async findOne(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({ where: { id } }) || null;
  }

  async updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED'): Promise<Order | null> {
    const order = await this.findOne(id);
    if (!order) {
      return null;
    }
    order.status = status;
    return this.orderRepository.save(order);
  }
}