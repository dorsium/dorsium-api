import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifySwagger, { SwaggerOptions } from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

async function swagger(app: FastifyInstance) {
  const userSchemas = [
    {
      $id: 'User',
      type: 'object',
      properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        username: { type: 'string' }
      },
      required: ['id', 'name', 'username']
    },
    {
      $id: 'UserInput',
      type: 'object',
      properties: {
        name: { type: 'string' },
        username: { type: 'string' }
      },
      required: ['name', 'username']
    },
    {
      $id: 'LoginInput',
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['username', 'password']
    },
    {
      $id: 'LoginResponse',
      type: 'object',
      properties: {
        token: { type: 'string' }
      },
      required: ['token']
    }
    ,
    {
      $id: 'UserResponse',
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        data: { $ref: 'User' }
      },
      required: ['ok', 'data']
    },
    {
      $id: 'TokenResponse',
      type: 'object',
      properties: {
        ok: { type: 'boolean' },
        data: { $ref: 'LoginResponse' }
      },
      required: ['ok', 'data']
    }
  ];

  const swaggerOptions: SwaggerOptions = {
    openapi: {
      info: {
        title: 'Dorsium API',
        description: 'Dorsium API docs',
        version: '1.0.0'
      },
      components: {
        schemas: {
          User: { $ref: 'User' },
          UserInput: { $ref: 'UserInput' },
          LoginInput: { $ref: 'LoginInput' },
          LoginResponse: { $ref: 'LoginResponse' },
          UserResponse: { $ref: 'UserResponse' },
          TokenResponse: { $ref: 'TokenResponse' }
        }
      }
    },
    refResolver: {
      buildLocalReference(json, _baseUri, _fragment, i) {
        return String(json.$id || `def-${i}`);
      }
    }
  };
  await app.register(fastifySwagger, swaggerOptions);

  userSchemas.forEach((schema) => app.addSchema(schema));

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true
  });
}

export default fastifyPlugin(swagger);
