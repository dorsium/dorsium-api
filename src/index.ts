import { buildServer } from './server.js';
import { env } from './config/env.js';

const app = buildServer();

const start = async () => {
  try {
    await app.listen({ port: Number(env.PORT), host: '0.0.0.0' });
    app.log.info('Server listening');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
