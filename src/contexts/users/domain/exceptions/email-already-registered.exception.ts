export class EmailAlreadyRegisteredException extends Error {
  constructor(email: string) {
    super(`El email '${email}' ya está registrado.`);
    this.name = 'EmailAlreadyRegisteredException';
  }
}
