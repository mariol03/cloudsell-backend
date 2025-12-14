import { ImageRepository } from "@/contexts/images/domain/image.repository";
import { ImageInMemoryRepository } from "@/contexts/images/infrastructure/image-inmemory.repository";
import { BaseUseCase } from "@/contexts/shared/base.use-case";
import { DownloadImageDto } from "./dto/download-image.dto";
import { ImageEntity } from "@/contexts/images/domain/image.entity";

export class DownloadImageUseCase extends BaseUseCase {
    private readonly imageRepository: ImageRepository;

    constructor(imageRepository: ImageRepository) {
        super();
        this.imageRepository = imageRepository || new ImageInMemoryRepository();
    }

    async execute(request?: DownloadImageDto): Promise<ImageEntity | null> {
        if (!request?.url) {
            throw new Error("Invalid request");
        }
        const image = await this.imageRepository.findByUrl(request.url);
        return image;
    }
}
