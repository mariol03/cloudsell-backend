import pino from "pino";
import { Logger } from "@shared/domain/logger/logger";

export class PinoLogger implements Logger {
    private readonly _logger: pino.Logger; // Le cambio el nombre a _logger para usar el getter

    constructor() {
        this._logger = pino({
            // ... tu configuración existente ...
            level: process.env.LOG_LEVEL || "info",
            transport: {
                target: "pino-pretty",
                options: {
                    colorize: true,
                    translateTime: "SYS:standard",
                    ignore: "pid,hostname",
                },
            },
        });
    }

    // --- NUEVO: Getter para que Fastify pueda acceder a la instancia nativa ---
    get instance(): pino.Logger {
        return this._logger;
    }

    // ... tus métodos debug, info, error siguen igual ...
    debug(message: string): void {
        this._logger.debug(message);
    }
    info(message: string): void {
        this._logger.info(message);
    }
    warn(message: string): void {
        this._logger.warn(message);
    }
    error(message: string | Error): void {
        if (message instanceof Error) {
            this._logger.error(message);
        } else {
            this._logger.error(message);
        }
    }
}
