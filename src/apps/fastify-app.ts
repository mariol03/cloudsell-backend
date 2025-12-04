import fastify from "fastify";
import { healthRoutes } from "../contexts/shared/infrastructure/health.fastify-route";
import { authRoutes } from "../contexts/users/infrastructure/auth.fastify-route";
import { userRoutes } from "../contexts/users/infrastructure/user.fastify-route";

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

app.register(healthRoutes, { prefix: "/health" });
app.register(authRoutes, { prefix: "/auth" });
app.register(userRoutes, { prefix: "/users" });

// Manejo de rutas no encontradas (404)
app.setNotFoundHandler((request, reply) => {
  reply.status(404).send({ message: 'Endpoint not found' });
});