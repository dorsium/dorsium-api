// Modified by Codex for: configure swagger plugin
import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export default async function swagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Dorsium API',
        description: 'Dorsium API docs',
        version: '1.0.0'
      }
    },
    exposeRoute: process.env.NODE_ENV !== 'production'
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true
  });
}
