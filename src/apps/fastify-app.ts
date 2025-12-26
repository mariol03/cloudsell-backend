import fastify from "fastify";
import { healthRoutes } from "../contexts/shared/infrastructure/health.fastify-route";
import { userRoutes } from "../contexts/users/infrastructure/user.fastify-route";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { swaggerOptions } from "../openapi";
import cors from "@fastify/cors";
import { itemRoutes } from "@/contexts/items/infrastructure/item.fastify-route";
import { imageRoutes } from "@/contexts/images/infrastructure/image.fastify-route";
import fastifyMultipart, { ajvFilePlugin } from "@fastify/multipart";
import { cartRoutes } from "@/contexts/cart/infrastructure/cart.fastify-route";
import { orderRoutes } from "@/contexts/orders/infrastructure/orders.fastify-route";

// registrar plugins y rutas
export const app = fastify({
    logger: {
        // ... tu configuración existente ...
        level: process.env.LOG_LEVEL || "info",
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
            },
        },
    },
    ajv: { plugins: [ajvFilePlugin] },
});

// Configurar multipart
app.register(fastifyMultipart, {
    attachFieldsToBody: true, // Importante para recibir el fichero en el body
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1, // Permitir solo un archivo
    },
});

// Configurar CORS
app.register(cors, {
    origin: (origin, cb) => {
        const allowedOrigins = [
            "http://localhost:3000",
            "http://localhost:3001",
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error("Origen no permitido"), false);
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Permitir cookies y encabezados de autenticación
});

// Registrar OpenAPI/Swagger
app.register(swagger as any, swaggerOptions as any);
app.register(swaggerUi as any, {
    routePrefix: "/docs",
    uiConfig: {
        docExpansion: "list",
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header,
    swagger: {
        url: "/openapi.json",
    },
});

// Exponer especificación OpenAPI en JSON
app.get("/openapi.json", async (_request, _reply) => {
    // @ts-except-error
    return app.swagger();
});

app.register(healthRoutes, { prefix: "/health" });
app.register(userRoutes, { prefix: "/auth" });
app.register(itemRoutes, { prefix: "/items" });
app.register(imageRoutes, { prefix: "/images" });
app.register(cartRoutes, { prefix: "/cart" });
app.register(orderRoutes, { prefix: "/orders" });

// Manejo de rutas no encontradas (404)
app.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ message: "Endpoint not found" });
});
