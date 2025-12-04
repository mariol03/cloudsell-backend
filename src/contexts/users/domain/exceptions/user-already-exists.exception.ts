export class UserAlreadyExistsException extends Error {
  constructor(tipo:string, campo: string) {
    super(`El usuario con ${tipo} '${campo}' ya existe.`);
    this.name = 'UserAlreadyExistsException';
  }
}
