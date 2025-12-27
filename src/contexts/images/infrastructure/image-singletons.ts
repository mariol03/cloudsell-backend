import { ImageRepository } from "../domain/image.repository";
import { MinIOImageRepository } from "./image-minio.repository";

export const imageRepositorySingleton: ImageRepository = new MinIOImageRepository();