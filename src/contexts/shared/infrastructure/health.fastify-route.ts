import { FastifyInstance, FastifyPluginOptions } from "fastify";

export const healthRoutes = async (fastify: FastifyInstance, _options: FastifyPluginOptions) => {
  fastify.get('/', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            uptime: { type: 'number' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const uptime = process.uptime();
    const seconds = Math.round(uptime);
    reply.send({ status: 'ok', uptime: seconds });
  });
}