import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';

const app = createApp();

const server = app.listen(env.PORT, (error) => {
  if (error) {
    console.error(`❌ Could not start the server on port ${env.PORT}:`, error.message);
    process.exit(1);
  }
  console.log(`🚗 API ready at http://localhost:${env.PORT}/api (${env.NODE_ENV})`);
});

function shutdown(signal: NodeJS.Signals) {
  console.log(`${signal} received, shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
