export class CategoryAlreadyFoundException extends Error {
    constructor(field: string, value: string) {
        super(`Category already exists with ${field}: ${value}`);
        this.name = 'CategoryAlreadyFoundException';
    }
}
