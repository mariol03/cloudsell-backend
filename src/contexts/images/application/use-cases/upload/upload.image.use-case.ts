import { ImageEntity } from "@/contexts/images/domain/image.entity";
import { ImageRepository } from "@/contexts/images/domain/image.repository";
import { ImageInMemoryRepository } from "@/contexts/images/infrastructure/image-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { UploadImageDTO } from "./dto/upload.image.dto";

export class UploadImageUseCase extends BaseUseCase {
    private readonly imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        super();
        this.imageRepository = imageRepository || new ImageInMemoryRepository();
    }

    async execute(request: UploadImageDTO): Promise<ImageEntity> {
        const { buffer, filename } = request;
        const image = new ImageEntity("", filename, buffer);
        const newImage = await this.imageRepository.create(image);
        return newImage;
    }
}
