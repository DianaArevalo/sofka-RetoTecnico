import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentPort } from '../../domain/ports/shipment.port';
import { Shipment, CreateShipmentDto } from '../../domain/entities/shipment.entity';
import { ShipmentOrmEntity } from './shipment.orm-entity';
import { ShipmentMapper } from '../../domain/mappers/shipment.mapper';
import { CustomerPort } from '../../../customers/domain/ports/customer.port';
import { ShipmentNotFoundException, CustomerNotActiveException, CustomerNotFoundShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class ShipmentRepository implements ShipmentPort {
  constructor(
    @InjectRepository(ShipmentOrmEntity)
    private readonly repository: Repository<ShipmentOrmEntity>,
    private readonly customerPort: CustomerPort,
  ) {}

  async findById(id: string): Promise<Shipment | null> {
    const ormEntity = await this.repository.findOne({ where: { id } });
    return ormEntity ? ShipmentMapper.toDomain(ormEntity) : null;
  }

  async findByCustomerId(customerId: string): Promise<Shipment[]> {
    const ormEntities = await this.repository
      .createQueryBuilder('shipment')
      .where('shipment.senderId = :customerId', { customerId })
      .orWhere('shipment.recipientId = :customerId', { customerId })
      .getMany();
    return ormEntities.map(ShipmentMapper.toDomain);
  }

  async create(dto: CreateShipmentDto, shippingCost: number, status: string): Promise<Shipment> {
    const sender = await this.customerPort.findById(dto.senderId);
    if (!sender) {
      throw new CustomerNotFoundShipmentException(dto.senderId);
    }
    if (!sender.isActive) {
      throw new CustomerNotActiveException(dto.senderId);
    }

    const recipient = await this.customerPort.findById(dto.recipientId);
    if (!recipient) {
      throw new CustomerNotFoundShipmentException(dto.recipientId);
    }
    if (!recipient.isActive) {
      throw new CustomerNotActiveException(dto.recipientId);
    }

    const ormEntity = this.repository.create({
      senderId: dto.senderId,
      recipientId: dto.recipientId,
      declaredValue: dto.declaredValue,
      shippingCost,
      type: dto.type,
      status: status as any,
      metadata: dto.metadata as unknown as Record<string, unknown>,
    });

    const saved = await this.repository.save(ormEntity);
    return ShipmentMapper.toDomain(saved);
  }
}