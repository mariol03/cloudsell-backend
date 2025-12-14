import { ImageEntity } from "../domain/image.entity";
import { ImageRepository } from "../domain/image.repository";
import Crypto from "crypto";

export class ImageInMemoryRepository implements ImageRepository {
    private images: ImageEntity[] = [];

    async create(image: ImageEntity): Promise<ImageEntity> {
        const hash = Crypto.createHash("sha256")
            .update(image.url)
            .digest("hex");
        const newImage = new ImageEntity(hash, image.alt, image.data);
        this.images.push(newImage);
        return newImage;
    }

    async delete(id: string): Promise<void> {
        const index = this.images.findIndex((image) => image.id === id);
        if (index !== -1) {
            this.images.splice(index, 1);
        }
    }

    async findByUrl(url: string): Promise<ImageEntity | null> {
        return this.images.find((image) => image.url === url) || null;
    }

    async findByName(name: string): Promise<ImageEntity | null> {
        return this.images.find((image) => image.alt === name) || null;
    }

    async update(uploadedImage: ImageEntity): Promise<ImageEntity | undefined> {
        const index = this.images.findIndex(
            (image) => image.url === uploadedImage.url,
        );
        if (index !== -1) {
            this.images[index] = uploadedImage;
            return uploadedImage;
        }
        return undefined;
    }
}
