import Fastify, { FastifyInstance } from 'fastify';
import swagger from './plugins/swagger.js';
import exampleRoutes from './routes/example.js';

export function buildServer(): FastifyInstance {
  const app = Fastify();

  app.register(swagger);

  app.get('/health', async () => ({ ok: true }));

  app.register(exampleRoutes);

  return app;
}
