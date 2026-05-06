import { Injectable, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class EventPublisher implements OnModuleInit {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async onModuleInit() {
    try {
      const url = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:25672';
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('order_events', { durable: true });
      console.log('RabbitMQ connection established in order-service');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  async publishOrderCreated(order: any): Promise<void> {
    if (!this.channel) {
      console.warn('RabbitMQ channel not available');
      return;
    }
    const message = JSON.stringify({ type: 'ORDER_CREATED', data: order });
    this.channel.sendToQueue('order_events', Buffer.from(message));
  }
}