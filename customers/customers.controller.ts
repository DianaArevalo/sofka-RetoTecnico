import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseFilters } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCustomerUseCase, GetAllCustomersUseCase, GetCustomerByIdUseCase, UpdateCustomerUseCase, DeleteCustomerUseCase } from './application/use-cases/customer.use-cases';
import { CreateCustomerInput, UpdateCustomerInput } from './domain/ports/customer.port';
import { CustomerMapper } from './infrastructure/persistence/customer.mapper';
import { CreateCustomerDto, UpdateCustomerDto } from './infrastructure/http/dtos/customer.dto';
import { CustomerResponseDto } from './infrastructure/http/dtos/customer-response.dto';
import { DomainExceptionFilter } from './infrastructure/filters/domain-exception.filter';
import { CustomerRole } from './domain/entities/customer-role.value-object';

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
  @ApiResponse({ status: 201, description: 'Cliente creado correctamente', type: CustomerResponseDto })
  @ApiResponse({ status: 409, description: 'Email duplicado' })
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const input: CreateCustomerInput = {
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role as unknown as CustomerRole,
    };
    const customer = await this.createCustomerUseCase.execute(input);
    return CustomerMapper.toResponse(customer);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes', type: [CustomerResponseDto] })
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.getAllCustomersUseCase.execute();
    return customers.map(CustomerMapper.toResponse);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerByIdUseCase.execute(id);
    return CustomerMapper.toResponse(customer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado', type: CustomerResponseDto })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const input: UpdateCustomerInput = {
      name: dto.name,
      role: dto.role as unknown as CustomerRole,
    };
    const customer = await this.updateCustomerUseCase.execute(id, input);
    return CustomerMapper.toResponse(customer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar cliente (soft delete)' })
  @ApiResponse({ status: 204, description: 'Cliente desactivado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }
}