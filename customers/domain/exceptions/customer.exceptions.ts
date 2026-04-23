export class EmailAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`El email ${email} ya está registrado`);
    this.name = 'EmailAlreadyExistsException';
  }
}

export class CustomerNotFoundException extends Error {
  constructor(id: string) {
    super(`Cliente con ID ${id} no encontrado`);
    this.name = 'CustomerNotFoundException';
  }
}