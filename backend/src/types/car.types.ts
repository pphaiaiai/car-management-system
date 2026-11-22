import type { z } from 'zod';

import type {
  carIdParamsSchema,
  createCarSchema,
  listCarsQuerySchema,
  updateCarSchema,
} from '../schemas/car.schema.js';

export type { Car } from '../generated/prisma/client.js';

export type CarIdParams = z.infer<typeof carIdParamsSchema>;
export type ListCarsQuery = z.infer<typeof listCarsQuerySchema>;
export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;

export type CarSortField = ListCarsQuery['sortBy'];
export type SortOrder = ListCarsQuery['order'];
