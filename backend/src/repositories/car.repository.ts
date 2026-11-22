import { Prisma } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import type {
  Car,
  CarSortField,
  CreateCarInput,
  SortOrder,
  UpdateCarInput,
} from '../types/car.types.js';
import { UniqueConstraintError } from './errors.js';

export interface FindCarsOptions {
  search?: string;
  brand?: string;
  sortBy: CarSortField;
  order: SortOrder;
  skip: number;
  take: number;
}

const isPrismaError = (error: unknown, code: string) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

const toRepositoryError = (error: unknown) =>
  isPrismaError(error, 'P2002') ? new UniqueConstraintError() : error;

function buildWhere({ search, brand }: Pick<FindCarsOptions, 'search' | 'brand'>) {
  const contains = (value: string) => ({ contains: value, mode: 'insensitive' as const });

  const where: Prisma.CarWhereInput = {};
  if (brand) {
    where.brand = { equals: brand, mode: 'insensitive' };
  }
  if (search) {
    where.OR = [
      { registrationNumber: contains(search) },
      { province: contains(search) },
      { brand: contains(search) },
      { model: contains(search) },
      { color: contains(search) },
      { notes: contains(search) },
    ];
  }
  return where;
}

function buildOrderBy(
  sortBy: CarSortField,
  order: SortOrder,
): Prisma.CarOrderByWithRelationInput[] {
  const primary: Prisma.CarOrderByWithRelationInput =
    sortBy === 'year' ? { year: { sort: order, nulls: 'last' } } : { [sortBy]: order };

  return [primary, { id: order }];
}

export async function findMany(options: FindCarsOptions) {
  const where = buildWhere(options);

  const [cars, total] = await prisma.$transaction([
    prisma.car.findMany({
      where,
      orderBy: buildOrderBy(options.sortBy, options.order),
      skip: options.skip,
      take: options.take,
    }),
    prisma.car.count({ where }),
  ]);

  return { cars, total };
}

export function findById(id: number): Promise<Car | null> {
  return prisma.car.findUnique({ where: { id } });
}

export async function findBrands(): Promise<string[]> {
  const rows = await prisma.car.findMany({
    distinct: ['brand'],
    select: { brand: true },
    orderBy: { brand: 'asc' },
  });
  return rows.map((row) => row.brand);
}

export async function create(data: CreateCarInput): Promise<Car> {
  try {
    return await prisma.car.create({ data });
  } catch (error) {
    throw toRepositoryError(error);
  }
}

export async function updateById(id: number, data: UpdateCarInput): Promise<Car | null> {
  try {
    return await prisma.car.update({ where: { id }, data });
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return null;
    throw toRepositoryError(error);
  }
}

export async function deleteById(id: number): Promise<Car | null> {
  try {
    return await prisma.car.delete({ where: { id } });
  } catch (error) {
    if (isPrismaError(error, 'P2025')) return null;
    throw error;
  }
}
