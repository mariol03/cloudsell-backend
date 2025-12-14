import { Client, ClientOptions } from "minio";
import {
    MINIO_ENDPOINT,
    MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY,
    MINIO_PORT,
} from "config";
import { getLogger } from "../logger/singleton.logger";

class UploadedFile {
    constructor(
        public bucketName: string,
        public fileName: string,
    ) {}
}

const logger = getLogger();

export class MinioClient {
    private client: Client;

    constructor() {
        const options: ClientOptions = {
            endPoint: MINIO_ENDPOINT,
            accessKey: MINIO_ACCESS_KEY,
            secretKey: MINIO_SECRET_KEY,
            port: MINIO_PORT,
            useSSL: false,
        };
        this.client = new Client(options);
    }

    async createBucket(bucketName: string): Promise<void> {
        await this.client.makeBucket(bucketName);
    }

    async createBucketIfNotExists(bucketName: string): Promise<void> {
        if (await this.client.bucketExists(bucketName)) {
            logger.error(`Bucket ${bucketName} already exists`);
        } else {
            await this.client.makeBucket(bucketName);
        }
    }

    async uploadFile(
        bucketName: string,
        fileName: string,
        file: Buffer,
    ): Promise<UploadedFile> {
        await this.client.putObject(bucketName, fileName, file);
        return new UploadedFile(bucketName, fileName);
    }

    async downloadFile(bucketName: string, fileName: string): Promise<Buffer> {
        try {
            const data = await this.client.getObject(bucketName, fileName);
            const chunks: Buffer[] = [];
            for await (const chunk of data) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            if (error instanceof Error)
                logger.error(`Error descargando archivo: ${error.message}`);
            throw error;
        }
    }

    async deleteFile(bucketName: string, fileName: string): Promise<void> {
        await this.client.removeObject(bucketName, fileName);
    }

    async listFiles(bucketName: string): Promise<string[]> {
        const files: string[] = [];
        const stream = this.client.listObjectsV2(bucketName);
        for await (const obj of stream) {
            files.push(obj.name);
        }
        return files;
    }
}
