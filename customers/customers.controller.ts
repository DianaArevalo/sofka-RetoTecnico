import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateCustomerUseCase, GetAllCustomersUseCase, GetCustomerByIdUseCase, UpdateCustomerUseCase, DeleteCustomerUseCase } from './application/use-cases/customer.use-cases';
import { CreateCustomerDto, UpdateCustomerDto } from './domain/entities/customer.entity';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';

@ApiTags('customers')
@Controller('customers')
@UseFilters(DomainExceptionFilter)
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado correctamente' })
  @ApiResponse({ status: 409, description: 'Email duplicado' })
  async create(@Body() dto: CreateCustomerDto) {
    return this.createCustomerUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes' })
  async findAll() {
    return this.getAllCustomersUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async findOne(@Param('id') id: string) {
    return this.getCustomerByIdUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
    return this.updateCustomerUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar cliente (soft delete)' })
  @ApiResponse({ status: 204, description: 'Cliente desactivado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async remove(@Param('id') id: string) {
    await this.deleteCustomerUseCase.execute(id);
  }
}