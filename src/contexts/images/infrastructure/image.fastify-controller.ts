import { FastifyReply, FastifyRequest } from "fastify";
import { UploadImageUseCase } from "@images/application/use-cases/upload/upload.image.use-case";
import { UploadImageDTO } from "@images/application/use-cases/upload/dto/upload.image.dto";
import { MultipartBody } from "./image.fastify-schemas";
import { DownloadImageDto } from "@images/application/use-cases/download/dto/download-image.dto";
import { DownloadImageUseCase } from "@images/application/use-cases/download/download-image.use-case";
import { imageRepositorySingleton } from "./image-singletons";

const uploadImageUseCase = new UploadImageUseCase(imageRepositorySingleton);
const downloadImageUseCase = new DownloadImageUseCase(imageRepositorySingleton);

export const uploadImageController = async (
    request: FastifyRequest,
    reply: FastifyReply,
) => {
    try {
        // Obtener el fichero cargado en el request
        const file = request.body as MultipartBody;

        // Validar el tipo de archivo
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedMimeTypes.includes(file.image.mimetype)) {
            return reply
                .status(400)
                .send({ error: "Only image files are allowed" });
        }

        // Validar el tamaño del archivo
        const maxSize = 5 * 1024 * 1024; // 5MB
        const buffer = await file.image.toBuffer();
        if (buffer.length > maxSize) {
            return reply
                .status(400)
                .send({ error: "File size exceeds the limit" });
        }

        // Convertir el request a DTO
        const dto: UploadImageDTO = {
            name: file.name.value,
            buffer,
            filename: file.image.filename,
            mimetype: file.image.mimetype,
        };

        // Ejecutar el caso de uso de carga de imagen
        const newImage = await uploadImageUseCase.execute(dto);

        // Devolver la respuesta
        return reply.status(201).send(newImage);
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
};

export const downloadImageController = async (
    request: FastifyRequest<{ Params: DownloadImageDto }>,
    reply: FastifyReply,
) => {
    try {
        const image = await downloadImageUseCase.execute(request.params);

        if (!image) {
            return reply.status(404).send({ error: "Image not found" });
        }

        const buffer = image.data;
        const filename = image.alt;

        reply.header("Content-Type", "image/jpeg");
        reply.header(
            "Content-Disposition",
            `attachment; filename="${filename}"`,
        );
        reply.send(buffer);
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
};
