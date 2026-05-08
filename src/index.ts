import 'dotenv/config';
import { config } from './config';
import app from './app';
import { connectRedis } from './lib/redis';
import { startWorkers } from './workers/crm.worker';

const start = async () => {
  await connectRedis(); // non-fatal — server starts even if Redis is down
  startWorkers();

  const port = process.env.PORT ? Number(process.env.PORT) : config.port;
  app.listen(port, '0.0.0.0', () => {
    console.log(`[server] Running on port ${port} (${config.nodeEnv})`);
    if (process.env.RAILWAY_STATIC_URL) {
      console.log(`[server] Railway public URL: https://${process.env.RAILWAY_STATIC_URL}`);
    }
  });
};

start().catch((err) => {
  console.error('[server] Failed to start:', err);
  process.exit(1);
});
