import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShipmentUseCase, GetShipmentByIdUseCase, GetShipmentsByCustomerUseCase } from './application/use-cases/shipment.use-cases';
import { CreateShipmentDto } from './domain/entities/shipment.entity';
import { ShipmentDomainExceptionFilter } from './infrastructure/filters/shipment-domain-exception.filter';

@ApiTags('shipments')
@Controller('shipments')
@UseFilters(ShipmentDomainExceptionFilter)
export class ShipmentsController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly getShipmentByIdUseCase: GetShipmentByIdUseCase,
    private readonly getShipmentsByCustomerUseCase: GetShipmentsByCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear envío' })
  @ApiResponse({ status: 201, description: 'Envío creado correctamente' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async create(@Body() dto: CreateShipmentDto) {
    return this.createShipmentUseCase.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener envío por ID' })
  @ApiResponse({ status: 200, description: 'Envío encontrado' })
  @ApiResponse({ status: 404, description: 'Envío no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getShipmentByIdUseCase.execute(id);
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Obtener envíos por cliente' })
  @ApiResponse({ status: 200, description: 'Lista de envíos' })
  async findByCustomer(@Param('id') id: string) {
    return this.getShipmentsByCustomerUseCase.execute(id);
  }
}