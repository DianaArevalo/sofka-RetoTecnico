export class CustomerNotFoundException extends Error {
  constructor(id: string) {
    super(`Cliente con ID ${id} no encontrado`);
    this.name = 'CustomerNotFoundException';
  }
}