import { config } from 'dotenv';
import { buildServer } from './server.js';

config();

const app = buildServer();

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
