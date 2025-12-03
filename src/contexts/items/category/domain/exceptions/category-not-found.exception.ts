export class CategoryNotFoundException extends Error {
    constructor(field: string, value: string) {
        super(`Category not found with ${field}: ${value}`);
        this.name = 'CategoryNotFoundException';
    }
}
