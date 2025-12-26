import { ImageEntity } from "@images/domain/image.entity";
import { ImageRepository } from "@images/domain/image.repository";
import { MinioClient } from "@shared/infrastructure/minio/minio.client";
import { getMinioClient } from "@shared/infrastructure/minio/minio.singleton";
import { getLogger } from "@shared/infrastructure/logger/singleton.logger";

const logger = getLogger();

export class MinIOImageRepository implements ImageRepository {
    private client: MinioClient;

    constructor() {
        this.client = getMinioClient();
        this.client.createBucketIfNotExists("images").catch(() => {
            logger.error("Error creating bucket");
        });
    }

    async create(image: ImageEntity): Promise<ImageEntity> {
        const { url } = await this.client.uploadFile(
            "images",
            image.alt,
            image.data,
            image.mimeType,
        );
        return { ...image, url };
    }

    async findByUrl(url: string): Promise<ImageEntity | null> {
        // const [bucketName, fileName] = url.split("/");
        const { buffer, mimeType } = await this.client.downloadFile("images", url);
        if (!buffer) return null;
        const image = new ImageEntity(url, "", buffer, mimeType);
        return image;
    }

    async findByName(name: string): Promise<ImageEntity | null> {
        const { buffer, mimeType } = await this.client.downloadFile("images", name);
        if (!buffer) return null;
        const image = new ImageEntity(name, name, buffer, mimeType);
        return image;
    }

    async update(image: ImageEntity): Promise<ImageEntity | undefined> {
        const { fileName, bucketName } = await this.client.uploadFile(
            "images",
            image.alt,
            image.data,
            image.mimeType,
        );
        return { ...image, url: `${bucketName}/${fileName}` };
    }

    async delete(id: string): Promise<void> {
        await this.client.deleteFile("images", id);
    }
}
