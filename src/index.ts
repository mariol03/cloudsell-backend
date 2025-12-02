import {app as fastifyApp} from './apps/fastify-app';
import { 
   FASTIFY_PORT } from './config';


fastifyApp.listen({ port: FASTIFY_PORT, host: "0.0.0.0" }, (err: Error | null, address: string) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`Fastify server running at ${address}`);
});
export { fastifyApp };