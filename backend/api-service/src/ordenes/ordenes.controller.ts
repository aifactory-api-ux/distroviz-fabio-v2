import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { OrdenesService } from './ordenes.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { Orden } from './dto/orden.dto';

@Controller('api/ordenes')
export class OrdenesController {
  constructor(private readonly ordenesService: OrdenesService) {}

  @Get()
  async findAll(): Promise<Orden[]> {
    return this.ordenesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrdenDto: CreateOrdenDto): Promise<Orden> {
    return this.ordenesService.create(createOrdenDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.ordenesService.delete(parseInt(id, 10));
  }
}