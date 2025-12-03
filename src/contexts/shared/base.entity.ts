// src/contexts/shared/base.entity.ts
// Entidad base para herencia en todas las entidades

import { randomUUID } from "node:crypto";

// Clase base para que otras entidades hereden campos comunes
export abstract class BaseEntity {
  /**
   * Identificador único de la entidad (por ejemplo, UUID)
   */
  id: string = randomUUID();

  /**
   * Fecha de creación del registro
   */
  createdAt: Date = new Date();

  /**
   * Fecha de última actualización
   */
  updatedAt: Date = new Date();

  /**
   * ID del usuario que creó el registro
   */
  createdBy: string = 'System'; // Por defecto, el sistema lo crea

  /**
   * ID del usuario que actualizó por última vez
   */
  updatedBy: string = 'System'; // Por defecto, el sistema lo actualiza
}

