import type { Request, Response } from 'express';

import * as carService from '../services/car.service.js';
import type {
  CarIdParams,
  CreateCarInput,
  ListCarsQuery,
  UpdateCarInput,
} from '../types/car.types.js';

export async function listCars(_req: Request, res: Response) {
  const query = res.locals.validated.query as ListCarsQuery;
  const { cars, meta } = await carService.listCars(query);
  res.json({ data: cars, meta });
}

export async function listBrands(_req: Request, res: Response) {
  const brands = await carService.listBrands();
  res.json({ data: brands });
}

export async function getCar(_req: Request, res: Response) {
  const { id } = res.locals.validated.params as CarIdParams;
  const car = await carService.getCar(id);
  res.json({ data: car });
}

export async function createCar(req: Request, res: Response) {
  const input = res.locals.validated.body as CreateCarInput;
  const car = await carService.createCar(input);
  res.status(201).location(`${req.baseUrl}/${car.id}`).json({ data: car });
}

export async function updateCar(_req: Request, res: Response) {
  const { id } = res.locals.validated.params as CarIdParams;
  const input = res.locals.validated.body as UpdateCarInput;
  const car = await carService.updateCar(id, input);
  res.json({ data: car });
}

export async function deleteCar(_req: Request, res: Response) {
  const { id } = res.locals.validated.params as CarIdParams;
  await carService.deleteCar(id);
  res.status(204).end();
}
