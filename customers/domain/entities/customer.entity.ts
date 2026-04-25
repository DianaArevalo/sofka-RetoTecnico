import { CustomerRole } from './customer-role.value-object';

export { CustomerRole };

export class Customer {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;
  readonly role: CustomerRole;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: CustomerRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  deactivate(): Customer {
    return new Customer({
      ...this,
      isActive: false,
      updatedAt: new Date(),
    });
  }

  canSendShipments(): boolean {
    return this.isActive && this.role === CustomerRole.SENDER;
  }

  isAdmin(): boolean {
    return this.role === CustomerRole.ADMIN;
  }

  withName(name: string): Customer {
    return new Customer({
      ...this,
      name,
      updatedAt: new Date(),
    });
  }

  withRole(role: CustomerRole): Customer {
    return new Customer({
      ...this,
      role,
      updatedAt: new Date(),
    });
  }
}