import { FastifyInstance } from 'fastify';
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export default async function swagger(app: FastifyInstance) {
  const swaggerOptions: SwaggerOptions = {
    openapi: {
      info: {
        title: 'Dorsium API',
        description: 'Dorsium API docs',
        version: '1.0.0'
      }
    }
  };
  await app.register(fastifySwagger, swaggerOptions);

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true
  });
}
