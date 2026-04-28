import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentPort } from '../../domain/ports/shipment.port';
import { Shipment } from '../../domain/entities/shipment.entity';
import { ShipmentOrmEntity } from './shipment.orm-entity';
import { ShipmentMapper } from './shipment.mapper';
import { CustomerPort } from '../../../customers/domain/ports/customer.port';
import { CustomerNotActiveException, CustomerNotFoundShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class ShipmentRepository implements ShipmentPort {
  constructor(
    @InjectRepository(ShipmentOrmEntity)
    private readonly repository: Repository<ShipmentOrmEntity>,
    @Inject('CustomerPort') private readonly customerPort: CustomerPort,
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

  async create(shipment: Shipment): Promise<Shipment> {
    const sender = await this.customerPort.findById(shipment.senderId);
    if (!sender) {
      throw new CustomerNotFoundShipmentException(shipment.senderId);
    }
    if (!sender.isActive) {
      throw new CustomerNotActiveException(shipment.senderId);
    }

    const recipient = await this.customerPort.findById(shipment.recipientId);
    if (!recipient) {
      throw new CustomerNotFoundShipmentException(shipment.recipientId);
    }
    if (!recipient.isActive) {
      throw new CustomerNotActiveException(shipment.recipientId);
    }

    const ormEntity = ShipmentMapper.toOrm(shipment);
    const saved = await this.repository.save(ormEntity);
    return ShipmentMapper.toDomain(saved);
  }
}