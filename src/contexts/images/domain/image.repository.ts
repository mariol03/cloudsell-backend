import { ImageEntity } from "./image.entity";

export interface ImageRepository {
    create(image: ImageEntity): Promise<ImageEntity>;
    findByUrl(url: string): Promise<ImageEntity | null>;
    findByName(name: string): Promise<ImageEntity | null>;
    update(image: ImageEntity): Promise<ImageEntity | undefined>;
    delete(id: string): Promise<void>;
}
