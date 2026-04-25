import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentPort, CreateShipmentInput } from '../../domain/ports/shipment.port';
import { Shipment, ShipmentStatus, Money } from '../../domain/entities/shipment.entity';
import { ShipmentOrmEntity } from './shipment.orm-entity';
import { ShipmentMapper } from './shipment.mapper';
import { CustomerPort } from '../../../customers/domain/ports/customer.port';
import { ShipmentNotFoundException, CustomerNotActiveException, CustomerNotFoundShipmentException } from '../../domain/exceptions/shipment.exceptions';
import { v4 as uuidv4 } from 'uuid';

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

  async create(input: CreateShipmentInput, shippingCost: Money, status: ShipmentStatus): Promise<Shipment> {
    const sender = await this.customerPort.findById(input.senderId);
    if (!sender) {
      throw new CustomerNotFoundShipmentException(input.senderId);
    }
    if (!sender.isActive) {
      throw new CustomerNotActiveException(input.senderId);
    }

    const recipient = await this.customerPort.findById(input.recipientId);
    if (!recipient) {
      throw new CustomerNotFoundShipmentException(input.recipientId);
    }
    if (!recipient.isActive) {
      throw new CustomerNotActiveException(input.recipientId);
    }

    const now = new Date();
    const ormEntity = this.repository.create({
      id: uuidv4(),
      senderId: input.senderId,
      recipientId: input.recipientId,
      declaredValue: input.declaredValue,
      shippingCost: shippingCost.value,
      type: input.type as unknown as number,
      status: status as unknown as number,
      metadata: input.metadata as Record<string, unknown>,
      createdAt: now,
      updatedAt: now,
    });

    const saved = await this.repository.save(ormEntity);
    return ShipmentMapper.toDomain(saved);
  }
}