import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
import { env } from '../config/env.js';

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.code(401).send({ ok: false, error: 'Unauthorized', status: 401 });
  }
}

async function auth(app: FastifyInstance) {
  await app.register(fastifyJwt, { secret: env.JWT_SECRET });
  app.decorate('authenticate', authenticate);
}

export default fastifyPlugin(auth);

 
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
