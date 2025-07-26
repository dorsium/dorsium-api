import Fastify, { FastifyInstance } from 'fastify';
import swagger from './plugins/swagger.js';
import auth from './plugins/auth.js';
import exampleRoutes from './routes/example.js';
import registerRoutes from './routes/register.js';
import userRoutes from './routes/user.js';

export function buildServer(): FastifyInstance {
  const app = Fastify();

  app.register(swagger);
  app.register(auth);

  app.get('/health', async () => ({ ok: true }));

  app.register(exampleRoutes);
  app.register(registerRoutes);
  app.register(userRoutes);

  return app;
}
