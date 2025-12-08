export const swaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'CloudSell API',
      version: '1.0.0',
      description: 'Documentación OpenAPI de CloudSell Backend',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Servidor local',
      },
    ],
  },
};
