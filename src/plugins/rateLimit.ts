import { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import fastifyPlugin from 'fastify-plugin';
import { env } from '../config/env.js';

async function rateLimitPlugin(app: FastifyInstance) {
  await app.register(rateLimit, {
    max: Number(env.RATE_LIMIT_MAX),
    timeWindow: env.RATE_LIMIT_TIME_WINDOW,
    global: true
  });
}

export default fastifyPlugin(rateLimitPlugin);
