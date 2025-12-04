import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(crypto.scrypt);

/**
 * Servicio para hashear y comparar contraseñas usando bcrypt nativo de Node.js
 */
export class PasswordHashService {
  /**
   * Hashea una contraseña usando scrypt con salt
   */
  static async hash(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, 64) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  /**
   * Compara una contraseña con su hash
   */
  static async compare(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(':');
    const derivedKey = await scrypt(password, salt, 64) as Buffer;
    return derivedKey.toString('hex') === key;
  }
}
