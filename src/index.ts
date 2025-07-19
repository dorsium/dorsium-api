import Fastify from 'fastify';
import { config } from 'dotenv';
import swagger from './plugins/swagger.js';

config();

const app = Fastify();

app.register(swagger);

app.get('/health', async () => ({ ok: true }));

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
    app.log.info('Server listening');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
