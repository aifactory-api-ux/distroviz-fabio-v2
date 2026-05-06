import { Controller, Get, Post, Patch, Body, Param, Query, Headers, Req } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Request } from 'express';

@Controller('api')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @Post('auth/login')
  async login(@Body() body: { username: string; password: string }) {
    return this.gatewayService.login(body.username, body.password);
  }

  @Get('auth/me')
  async getMe(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.gatewayService.getMe(token);
  }

  @Post('orders')
  async createOrder(@Body() body: { userId: string; productId: string; quantity: number }) {
    return this.gatewayService.createOrder(body);
  }

  @Get('orders')
  async getOrders(@Query('userId') userId?: string) {
    return this.gatewayService.getOrders(userId);
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.gatewayService.getOrder(id);
  }

  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: { status: 'PENDING' | 'CONFIRMED' | 'DISPATCHED' | 'CANCELLED' },
  ) {
    return this.gatewayService.updateOrderStatus(id, body.status);
  }

  @Get('inventory/:productId')
  async getInventory(@Param('productId') productId: string) {
    return this.gatewayService.getInventory(productId);
  }

  @Post('inventory/check')
  async checkInventory(@Body() body: { productId: string; quantity: number }) {
    return this.gatewayService.checkInventory(body.productId, body.quantity);
  }

  @Get('products')
  async getProducts() {
    return this.gatewayService.getProducts();
  }

  @Get('products/:id')
  async getProduct(@Param('id') id: string) {
    return this.gatewayService.getProduct(id);
  }
}