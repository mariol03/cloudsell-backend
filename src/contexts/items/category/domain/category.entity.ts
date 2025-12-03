import { BaseEntity } from '@shared/base.entity';

export class CategoryEntity extends BaseEntity {
    private _name!: string
    private _description?: string;
    private _isActive: boolean = true; // Por defecto, la categoría está activa

    constructor(name: string, description?: string) {
        super(); // Llama al constructor de la clase base
        this._name = name;
        this._description = description;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string | undefined {
        return this._description;
    }

    set description(value: string | undefined) {
        this._description = value;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }
}
