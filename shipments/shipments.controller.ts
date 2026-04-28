import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateShipmentUseCase, GetShipmentByIdUseCase, GetShipmentsByCustomerUseCase } from './application/use-cases/shipment.use-cases';
import { CreateShipmentInput } from './domain/ports/shipment.port';
import { ShipmentMapper } from './infrastructure/persistence/shipment.mapper';
import { CreateShipmentDto, ShipmentTypeEnum } from './infrastructure/http/dtos/create-shipment.dto';
import { ShipmentResponseDto } from './infrastructure/http/dtos/shipment-response.dto';
import { ShipmentDomainExceptionFilter } from './infrastructure/filters/shipment-domain-exception.filter';
import { ShipmentType } from './domain/entities/shipment-type.value-object';

@ApiTags('shipments')
@Controller('shipments')
@UseFilters(ShipmentDomainExceptionFilter)
export class ShipmentsController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly getShipmentByIdUseCase: GetShipmentByIdUseCase,
    private readonly getShipmentsByCustomerUseCase: GetShipmentsByCustomerUseCase,
  ) {}

  private mapStringToShipmentType(type: ShipmentTypeEnum): ShipmentType {
    const mapping: Record<ShipmentTypeEnum, ShipmentType> = {
      [ShipmentTypeEnum.STANDARD]: ShipmentType.STANDARD,
      [ShipmentTypeEnum.EXPRESS]: ShipmentType.EXPRESS,
      [ShipmentTypeEnum.INTERNATIONAL]: ShipmentType.INTERNATIONAL,
      [ShipmentTypeEnum.THIRD_PARTY_CARRIER]: ShipmentType.THIRD_PARTY_CARRIER,
    };
    return mapping[type];
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear envío' })
  @ApiResponse({ status: 201, description: 'Envío creado correctamente' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async create(@Body() dto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    const input: CreateShipmentInput = {
      senderId: dto.senderId,
      recipientId: dto.recipientId,
      declaredValue: dto.declaredValue,
      type: this.mapStringToShipmentType(dto.type),
      metadata: dto.metadata as Record<string, unknown> | undefined,
    };
    const shipment = await this.createShipmentUseCase.execute(input);
    return ShipmentMapper.toResponse(shipment);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener envío por ID' })
  @ApiResponse({ status: 200, description: 'Envío encontrado' })
  @ApiResponse({ status: 404, description: 'Envío no encontrado' })
  async findOne(@Param('id') id: string): Promise<ShipmentResponseDto> {
    const shipment = await this.getShipmentByIdUseCase.execute(id);
    return ShipmentMapper.toResponse(shipment);
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Obtener envíos por cliente' })
  @ApiResponse({ status: 200, description: 'Lista de envíos' })
  async findByCustomer(@Param('id') id: string): Promise<ShipmentResponseDto[]> {
    const shipments = await this.getShipmentsByCustomerUseCase.execute(id);
    return shipments.map(ShipmentMapper.toResponse);
  }
}