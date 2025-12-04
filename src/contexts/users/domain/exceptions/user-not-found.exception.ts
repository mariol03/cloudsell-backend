export class UserNotFoundException extends Error {
  constructor(tipo:string, campo: string) {
    super(`El usuario con ${tipo} '${campo}' no fue encontrado.`);
    this.name = 'UserNotFoundException';
  }
}