import { BaseEntity } from "@shared/base.entity";

export class ImageEntity extends BaseEntity {
    public readonly url: string;
    public readonly alt: string;
    public readonly data: Buffer;

    constructor(url: string, alt: string, data: Buffer) {
        super();
        this.url = url;
        this.alt = alt;
        this.data = data;
    }
}
