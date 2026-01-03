export class InsufficientStockException extends Error {
    constructor(itemName: string, requestedQuantity: number, availableStock: number) {
        super(`Insufficient stock for item "${itemName}": requested ${requestedQuantity}, available ${availableStock}`);
        this.name = 'InsufficientStockException';
    }
}