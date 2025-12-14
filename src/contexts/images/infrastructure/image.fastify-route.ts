import { FastifyInstance } from "fastify/types/instance";
import {
    downloadImageController,
    uploadImageController,
} from "./image.fastify-controller";
import {
    downloadImageSchema,
    uploadImageSchema,
} from "./image.fastify-schemas";

export const imageRoutes = async (fastify: FastifyInstance) => {
    fastify.post("", { schema: uploadImageSchema }, uploadImageController);
    fastify.get(
        "/:url",
        { schema: downloadImageSchema },
        downloadImageController,
    );
};
