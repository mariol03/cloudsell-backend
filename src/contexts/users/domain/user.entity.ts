import { BaseEntity } from "@shared/base.entity";
import { SellerStats } from "./seller.stats";
import { BuyerStats } from "./buyer.stats";

export enum UserRole {
    BUYER = "buyer",
    SELLER = "seller",
}

export class UserEntity extends BaseEntity {
    private _name!: string;
    private _email!: string;
    private _password!: string; // Hash de la contraseña
    private _image!: string | null;
    private _role: UserRole = UserRole.BUYER;
    private _sellerStats: SellerStats | null = null;
    private _buyerStats: BuyerStats | null = null;

    constructor(
        name: string,
        email: string,
        password: string,
        role: UserRole = UserRole.BUYER,
        image: string | null = null,
        sellerStats: SellerStats | null = null,
        buyerStats: BuyerStats | null = null,
    ) {
        super(); // Llama al constructor de la clase base
        this._name = name;
        this._email = email;
        this._password = password;
        this._role = role;
        this._image = image;
        this._sellerStats = sellerStats;
        this._buyerStats = buyerStats;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get role(): UserRole {
        return this._role;
    }

    set role(value: UserRole) {
        this._role = value;
    }

    get image(): string | null {
        return this._image;
    }

    set image(value: string | null) {
        this._image = value;
    }

    get sellerStats(): SellerStats | null {
        return this._sellerStats;
    }

    set sellerStats(value: SellerStats | null) {
        this._sellerStats = value;
    }

    get buyerStats(): BuyerStats | null {
        return this._buyerStats;
    }

    set buyerStats(value: BuyerStats | null) {
        this._buyerStats = value;
    }
}
