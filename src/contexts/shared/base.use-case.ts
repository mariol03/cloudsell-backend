export abstract class BaseUseCase {
    /**
     * Método que debe ser implementado por las subclases para ejecutar la lógica del caso de uso.
     * @param request - El objeto de solicitud que contiene los datos necesarios para ejecutar el caso de uso.
     * @returns Una promesa que resuelve con el resultado del caso de uso o void si no hay resultado.
     */
    abstract execute(request?: unknown): Promise<unknown>;
}