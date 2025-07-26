import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import {
  registerUser,
  getUser,
  verifyCredentials
} from '../services/userService.js';

const createSchema = z.object({
  name: z.string(),
  username: z.string()
});

const paramsSchema = z.object({
  id: z.coerce.number()
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

export default async function userRoutes(app: FastifyInstance) {
  app.post('/users', async (request, reply) => {
    try {
      const body = createSchema.parse(request.body);
      const data = await registerUser(body);
      return { ok: true, data };
    } catch (err) {
      request.log.error(err);
      reply.code(500);
      return { ok: false, error: 'User creation failed', status: 500 };
    }
  });

  app.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);
      const user = await verifyCredentials(body);
      const token = await reply.jwtSign({ id: user.id });
      return { ok: true, data: { token } };
    } catch (err) {
      request.log.error(err);
      reply.code(401);
      return { ok: false, error: 'Invalid credentials', status: 401 };
    }
  });

  app.get('/users/:id', async (request, reply) => {
    try {
      const { id } = paramsSchema.parse(request.params);
      const data = await getUser(id);
      return { ok: true, data };
    } catch (err) {
      request.log.error(err);
      reply.code(500);
      return { ok: false, error: 'User fetch failed', status: 500 };
    }
  });
}
