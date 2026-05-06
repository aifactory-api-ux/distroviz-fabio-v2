import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll() {
    const products = await this.productService.findAll();
    return { products };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
}