import { z } from 'zod';

const MAX_INT32 = 2_147_483_647;
const MAX_YEAR = new Date().getFullYear() + 1;

const emptyToNull = (value: unknown) =>
  typeof value === 'string' && value.trim() === '' ? null : value;

const requiredText = (label: string, max: number) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined || issue.input === null
          ? `${label} is required`
          : `${label} must be text`,
    })
    .trim()
    .min(1, `${label} is required`)
    .max(max, `${label} must be at most ${max} characters`);

const optionalText = (label: string, max: number) =>
  z.preprocess(
    emptyToNull,
    z.string().trim().max(max, `${label} must be at most ${max} characters`).nullable().optional(),
  );

const optionalQueryText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

export const CAR_SORT_FIELDS = [
  'registrationNumber',
  'province',
  'brand',
  'model',
  'year',
  'createdAt',
  'updatedAt',
] as const;

export const carIdParamsSchema = z.object({
  id: z.coerce
    .number({ error: 'Car id must be a positive integer' })
    .int('Car id must be a positive integer')
    .min(1, 'Car id must be a positive integer')
    .max(MAX_INT32, 'Car id is too large'),
});

export const listCarsQuerySchema = z.object({
  q: optionalQueryText(100),
  brand: optionalQueryText(50),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(CAR_SORT_FIELDS).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export const createCarSchema = z.object(
  {
    registrationNumber: requiredText('Registration number', 20)
      .regex(
        /^[0-9ก-ฮ -]+$/,
        'Registration number may only contain Thai letters, digits, spaces and hyphens',
      )
      .regex(/[0-9]/, 'Registration number must contain at least one digit')
      .transform((value) => value.replace(/\s+/g, ' ')),
    province: requiredText('Province', 50),
    brand: requiredText('Brand', 50),
    model: requiredText('Model', 100),
    year: z.preprocess(
      emptyToNull,
      z
        .number({ error: 'Year must be a number' })
        .int('Year must be a whole number')
        .min(1900, 'Year must be 1900 or later')
        .max(MAX_YEAR, `Year must be ${MAX_YEAR} or earlier`)
        .nullable()
        .optional(),
    ),
    color: optionalText('Color', 30),
    notes: optionalText('Notes', 1000),
  },
  { error: 'Request body must be a JSON object' },
);

export const updateCarSchema = createCarSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    error: 'Provide at least one field to update',
  });
