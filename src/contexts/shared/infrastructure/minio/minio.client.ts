import { Client, ClientOptions, ItemBucketMetadata } from "minio";
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
        public url: string,
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

    private async setPublicPolicy(bucketName: string): Promise<void> {
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Sid: "PublicRead",
                    Effect: "Allow",
                    Principal: { AWS: ["*"] }, // Acceso a todos
                    Action: ["s3:GetObject"], // Solo lectura
                    Resource: [`arn:aws:s3:::${bucketName}/*`], // Todos los archivos
                },
            ],
        };

        try {
            await this.client.setBucketPolicy(
                bucketName,
                JSON.stringify(policy),
            );
            logger.info(`Política pública aplicada al bucket '${bucketName}'`);
        } catch (error) {
            logger.error(`Error aplicando política al bucket ${bucketName}:`);
            throw error;
        }
    }

    async createBucket(bucketName: string): Promise<void> {
        await this.client.makeBucket(bucketName);
    }

    async createBucketIfNotExists(bucketName: string): Promise<void> {
        if (await this.client.bucketExists(bucketName)) {
            logger.info(`Bucket ${bucketName} already exists`);
        } else {
            await this.client.makeBucket(bucketName);
        }

        await this.setPublicPolicy(bucketName);
    }

    getPublicUrl(bucketName: string, fileName: string): string {
        const protocol = "http"; // O https según tu config
        // Asegúrate de que MINIO_ENDPOINT no tenga 'http://' delante en tu config, solo la IP/Dominio
        return `${protocol}://${MINIO_ENDPOINT}:${MINIO_PORT}/${bucketName}/${encodeURIComponent(fileName)}`;
    }

    async uploadFile(
        bucketName: string,
        fileName: string,
        file: Buffer,
        mimeType?: string,
    ): Promise<UploadedFile> {
        const metadata: ItemBucketMetadata = mimeType
            ? { "Content-Type": mimeType }
            : {};
        await this.client.putObject(
            bucketName,
            fileName,
            file,
            metadata as any,
        );
        const url = this.getPublicUrl(bucketName, fileName);
        return new UploadedFile(bucketName, fileName, url);
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
