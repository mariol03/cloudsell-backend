export const swaggerOptions = {
    openapi: {
        openapi: "3.0.0",
        info: {
            title: "CloudSell API",
            version: "1.0.0",
            description: "Documentación OpenAPI de CloudSell Backend",
        },
        servers: [
            {
                url: process.env.BASE_URL || "http://localhost:3000",
                description: "Servidor local",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        // --- CORRECCIÓN AQUÍ ---
        // La seguridad global va DENTRO de 'openapi', al mismo nivel que 'components'
        security: [{ bearerAuth: [] }],
    },
    // Borra la propiedad 'schema' de aquí abajo, no sirve en la configuración global
};
