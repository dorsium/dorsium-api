import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getExample } from '../services/exampleService.js';

const querySchema = z.object({
  name: z.string().optional()
});

export default async function exampleRoutes(app: FastifyInstance) {
  app.get('/example', async (request) => {
    const { name } = querySchema.parse(request.query);
    const data = await getExample(name);
    return { ok: true, data };
  });
}
