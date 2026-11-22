export interface Car {
  id: number;
  registrationNumber: string;
  province: string;
  brand: string;
  model: string;
  year: number | null;
  color: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CarInput {
  registrationNumber: string;
  province: string;
  brand: string;
  model: string;
  year?: number | null;
  color?: string | null;
  notes?: string | null;
}

export type CarSortField =
  'registrationNumber' | 'province' | 'brand' | 'model' | 'year' | 'createdAt' | 'updatedAt';

export interface ListCarsParams {
  search?: string;
  brand?: string;
  page?: number;
  pageSize?: number;
  sortBy?: CarSortField;
  order?: 'asc' | 'desc';
}
