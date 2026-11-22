import * as healthRepository from '../repositories/health.repository.js';

export async function getHealth() {
  const isDatabaseUp = await healthRepository.pingDatabase();

  return {
    status: isDatabaseUp ? 'ok' : 'degraded',
    database: isDatabaseUp ? 'up' : 'down',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  } as const;
}
