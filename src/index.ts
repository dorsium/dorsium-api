import { buildServer } from './server.js';
import { env } from './config/env.js';

const app = buildServer();

const start = async () => {
  try {
    await app.listen({ port: Number(env.PORT), host: '0.0.0.0' });
    app.log.info('Server listening');
  } catch (err: unknown) {
    app.log.error(err);
    process.exitCode = 1;
    throw err;
  }
};

start();
