export class InvalidShipmentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidShipmentException';
  }
}

export class ShipmentNotFoundException extends Error {
  constructor(id: string) {
    super(`Envío con ID ${id} no encontrado`);
    this.name = 'ShipmentNotFoundException';
  }
}

export class CustomerNotActiveException extends Error {
  constructor(id: string) {
    super(`Cliente con ID ${id} no está activo`);
    this.name = 'CustomerNotActiveException';
  }
}

export class CustomerNotFoundShipmentException extends Error {
  constructor(id: string) {
    super(`Cliente con ID ${id} no encontrado`);
    this.name = 'CustomerNotFoundShipmentException';
  }
}