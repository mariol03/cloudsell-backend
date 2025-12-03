export class ItemAlreadyExistsException extends Error {
  constructor(name:string, value: string) {
    super(`El item con el "${name}" "${value}" ya existe`);
    this.name = 'ItemAlreadyExistsException';
  }
}