export class InvalidCredentialsException extends Error {
  constructor() {
    super('Email o contraseña inválidos.');
    this.name = 'InvalidCredentialsException';
  }
}
