import { Client, ClientOptions } from "minio";
import { MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY } from "config";

class UploadedFile {
    constructor(
        public bucketName: string,
        public fileName: string,
    ) {}
}

export class MinioClient {
    private client: Client;

    constructor() {
        const options: ClientOptions = {
            endPoint: MINIO_ENDPOINT,
            accessKey: MINIO_ACCESS_KEY,
            secretKey: MINIO_SECRET_KEY,
            useSSL: false,
        };
        this.client = new Client(options);
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
        const data = await this.client.getObject(bucketName, fileName);
        const buffer = await data.read();
        return buffer;
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
