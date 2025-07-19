import Fastify, { FastifyInstance } from 'fastify';
import swagger from './plugins/swagger.js';

export function buildServer(): FastifyInstance {
  const app = Fastify();

  app.register(swagger);

  app.get('/health', async () => ({ ok: true }));

  return app;
}
