import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { registerUser } from '../services/registerService.js';

const bodySchema = z.object({
  name: z.string(),
  username: z.string(),
  authUserId: z.string().uuid(),
  country: z.string()
});

export default async function registerRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    try {
      const body = bodySchema.parse(request.body);
      const data = await registerUser(body);
      return { ok: true, data };
    } catch (err) {
      request.log.error(err);
      reply.code(500);
      return { ok: false, error: 'Registration failed', status: 500 };
    }
  });
}
