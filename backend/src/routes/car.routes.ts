import { Router } from 'express';

import * as carController from '../controllers/car.controller.js';
import { validate } from '../middlewares/validate.js';
import {
  carIdParamsSchema,
  createCarSchema,
  listCarsQuerySchema,
  updateCarSchema,
} from '../schemas/car.schema.js';

export const carRouter = Router();

carRouter.get('/', validate({ query: listCarsQuerySchema }), carController.listCars);
carRouter.get('/brands', carController.listBrands);
carRouter.get('/:id', validate({ params: carIdParamsSchema }), carController.getCar);
carRouter.post('/', validate({ body: createCarSchema }), carController.createCar);
carRouter.patch(
  '/:id',
  validate({ params: carIdParamsSchema, body: updateCarSchema }),
  carController.updateCar,
);
carRouter.delete('/:id', validate({ params: carIdParamsSchema }), carController.deleteCar);
