import { PinoLogger } from "./console.logger";
import { Logger } from "@shared/domain/logger/logger";

// Instanciamos
const pinoLogger = new PinoLogger();

// Exportación para el Dominio (Casos de Uso) -> Solo ven la Interfaz
export function getLogger(): Logger {
    return pinoLogger;
}

// Exportación para Infraestructura (Fastify) -> Ve la clase completa
export { pinoLogger };
