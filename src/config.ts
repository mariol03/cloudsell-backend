export const BACKEND_PORT: number = parseInt(
    process.env.BACKEND_PORT ?? "3000",
    10,
);
export const MINIO_ENDPOINT: string = process.env.MINIO_ENDPOINT ?? "localhost";
export const MINIO_ACCESS_KEY: string =
    process.env.MINIO_ACCESS_KEY ?? "minioadmin";
export const MINIO_SECRET_KEY: string =
    process.env.MINIO_SECRET_KEY ?? "minioadmin";
export const MINIO_PORT: number = parseInt(
    process.env.MINIO_PORT ?? "9000",
    10,
);
