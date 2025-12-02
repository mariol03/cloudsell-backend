import fastify from "fastify";

export const app = fastify({
    logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Manejo de rutas no encontradas (404)
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({ message: 'Endpoint not found' });
});