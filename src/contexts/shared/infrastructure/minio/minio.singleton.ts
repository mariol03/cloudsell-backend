import { MinioClient } from "./minio.client";

const minioClientSingleton = new MinioClient();

export function getMinioClient(): MinioClient {
    return minioClientSingleton;
}
