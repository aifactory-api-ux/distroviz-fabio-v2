import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('api/inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get(':productId')
  async getInventory(@Param('productId') productId: string) {
    return this.inventoryService.findByProductId(productId);
  }

  @Post('check')
  async checkInventory(@Body() body: { productId: string; quantity: number }) {
    return this.inventoryService.checkAvailability(body.productId, body.quantity);
  }
}