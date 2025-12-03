export class CategoryInvalidDataException extends Error {
    constructor(message: string = 'Invalid category data') {
        super(message);
        this.name = 'CategoryInvalidDataException';
    }
}
