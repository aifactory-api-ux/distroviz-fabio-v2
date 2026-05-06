import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('api/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  async create(@Body() body: { userId: string; productId: string; quantity: number }) {
    const order = await this.orderService.createOrder(body);
    return { order };
  }

  @Get()
  async findAll(@Query('userId') userId?: string) {
    const orders = await this.orderService.findAll(userId);
    return { orders };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED' },
  ) {
    return this.orderService.updateStatus(id, body.status);
  }
}