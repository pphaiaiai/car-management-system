import { Router } from 'express';

import { carRouter } from './car.routes.js';
import { healthRouter } from './health.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/cars', carRouter);
