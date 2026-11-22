import type { ListResponse } from '../types/api';
import type { Car, CarInput, ListCarsParams } from '../types/car';
import { api } from './client';

export async function listCars(params: ListCarsParams = {}) {
  const { data } = await api.get<ListResponse<Car>>('/cars', { params });
  return data;
}

export async function listBrands() {
  const { data } = await api.get<{ data: string[] }>('/cars/brands');
  return data.data;
}

export async function getCar(id: number) {
  const { data } = await api.get<{ data: Car }>(`/cars/${id}`);
  return data.data;
}

export async function createCar(input: CarInput) {
  const { data } = await api.post<{ data: Car }>('/cars', input);
  return data.data;
}

export async function updateCar(id: number, input: Partial<CarInput>) {
  const { data } = await api.patch<{ data: Car }>(`/cars/${id}`, input);
  return data.data;
}

export async function deleteCar(id: number) {
  await api.delete(`/cars/${id}`);
}
