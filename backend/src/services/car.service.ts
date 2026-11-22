import * as carRepository from '../repositories/car.repository.js';
import { UniqueConstraintError } from '../repositories/errors.js';
import type { PaginationMeta } from '../types/api.types.js';
import type { CreateCarInput, ListCarsQuery, UpdateCarInput } from '../types/car.types.js';
import { AppError } from '../utils/AppError.js';

const carNotFound = (id: number) => AppError.notFound(`Car with id ${id} not found`);

const toServiceError = (error: unknown) =>
  error instanceof UniqueConstraintError
    ? AppError.conflict('A car with this registration number already exists in this province', [
        {
          location: 'body',
          field: 'registrationNumber',
          message: 'This registration number is already registered in this province',
        },
      ])
    : error;

export async function listCars(query: ListCarsQuery) {
  const { q, brand, page, pageSize, sortBy, order } = query;

  const { cars, total } = await carRepository.findMany({
    search: q,
    brand,
    sortBy,
    order,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const meta: PaginationMeta = {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };

  return { cars, meta };
}

export function listBrands() {
  return carRepository.findBrands();
}

export async function getCar(id: number) {
  const car = await carRepository.findById(id);
  if (!car) throw carNotFound(id);
  return car;
}

export async function createCar(input: CreateCarInput) {
  try {
    return await carRepository.create(input);
  } catch (error) {
    throw toServiceError(error);
  }
}

export async function updateCar(id: number, input: UpdateCarInput) {
  try {
    const car = await carRepository.updateById(id, input);
    if (!car) throw carNotFound(id);
    return car;
  } catch (error) {
    throw toServiceError(error);
  }
}

export async function deleteCar(id: number) {
  const car = await carRepository.deleteById(id);
  if (!car) throw carNotFound(id);
}
