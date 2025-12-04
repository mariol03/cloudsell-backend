// entidad de usuario
// src/contexts/users/user.entity.ts
import { BaseEntity } from "@shared/base.entity";

export enum UserRole {
  BUYER = "buyer",
  SELLER = "seller"
}

export class UserEntity extends BaseEntity {
  private _name!: string;
  private _email!: string;
  private _password!: string; // Hash de la contraseña
  private _role: UserRole = UserRole.BUYER;
  private _isVerified: boolean = false; // Por defecto, el usuario no está verificado
  
  constructor(name: string, email: string, password: string, role: UserRole = UserRole.BUYER) {
    super(); // Llama al constructor de la clase base
    this._name = name;
    this._email = email;
    this._password = password;
    this._role = role;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get role(): UserRole {
    return this._role;
  }

  set role(value: UserRole) {
    this._role = value;
  }

  get isVerified(): boolean {
    return this._isVerified;
  }

  set isVerified(value: boolean) {
    this._isVerified = value;
  }
}
