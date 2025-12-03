export class InvalidItemDataException extends Error {
  constructor() {
    super('Todos los campos son obligatorios');
    this.name = 'InvalidItemDataException';
  }
}