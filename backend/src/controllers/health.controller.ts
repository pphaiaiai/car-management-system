import type { Request, Response } from 'express';

import * as healthService from '../services/health.service.js';

export async function getHealth(_req: Request, res: Response) {
  const health = await healthService.getHealth();
  res.status(health.status === 'ok' ? 200 : 503).json(health);
}
