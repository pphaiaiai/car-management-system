import { App, Button, Flex, Input, Popconfirm, Select, Table, Typography } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';

import { deleteCar, listBrands, listCars } from '../api/cars';
import { getErrorMessage } from '../api/client';
import { CarDetailModal } from '../components/CarDetailModal';
import { CarFormModal } from '../components/CarFormModal';
import type { ListResponse } from '../types/api';
import type { Car, CarSortField, ListCarsParams } from '../types/car';

const SORTABLE_FIELDS: CarSortField[] = [
  'registrationNumber',
  'province',
  'brand',
  'model',
  'year',
];

const isSortField = (value: string | null): value is CarSortField =>
  SORTABLE_FIELDS.includes(value as CarSortField);

function parseQuery(params: URLSearchParams): ListCarsParams {
  const sortBy = params.get('sortBy');
  const order = params.get('order');
  return {
    search: params.get('search') || undefined,
    brand: params.get('brand') || undefined,
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: Math.min(100, Math.max(1, Number(params.get('pageSize')) || 10)),
    sortBy: isSortField(sortBy) ? sortBy : undefined,
    order: order === 'asc' || order === 'desc' ? order : undefined,
  };
}

const orDash = (value: string | number | null) => value ?? '-';

export function CarListPage() {
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseQuery(searchParams), [searchParams]);

  const [reloadKey, setReloadKey] = useState(0);
  const requestKey = `${searchParams.toString()}|${reloadKey}`;
  const [loaded, setLoaded] = useState<{ key: string; result: ListResponse<Car> | null }>({
    key: '',
    result: null,
  });
  const loading = loaded.key !== requestKey;
  const result = loaded.result;

  const [brands, setBrands] = useState<string[]>([]);
  const [formModal, setFormModal] = useState<{ open: boolean; car: Car | null; key: number }>({
    open: false,
    car: null,
    key: 0,
  });
  const [detailModal, setDetailModal] = useState<{ open: boolean; car: Car | null }>({
    open: false,
    car: null,
  });

  const [searchText, setSearchText] = useState(query.search ?? '');
  const [syncedSearch, setSyncedSearch] = useState(query.search);
  if (syncedSearch !== query.search) {
    setSyncedSearch(query.search);
    setSearchText(query.search ?? '');
  }

  useEffect(() => {
    listBrands()
      .then(setBrands)
      .catch(() => setBrands([]));
  }, [reloadKey]);

  useEffect(() => {
    let ignore = false;

    listCars(query)
      .then((data) => {
        if (!ignore) setLoaded({ key: requestKey, result: data });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        message.error(getErrorMessage(error));
        setLoaded((previous) => ({ key: requestKey, result: previous.result }));
      });

    return () => {
      ignore = true;
    };
  }, [query, requestKey, message]);

  const updateQuery = (changes: Partial<ListCarsParams>) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries({ ...query, ...changes })) {
      if (value !== undefined && value !== '') next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const openForm = (car: Car | null) => {
    setDetailModal((current) => ({ ...current, open: false }));
    setFormModal((current) => ({ open: true, car, key: current.key + 1 }));
  };

  const closeForm = () => setFormModal((current) => ({ ...current, open: false }));

  const handleSaved = () => {
    closeForm();
    setReloadKey((key) => key + 1);
  };

  const handleDelete = async (car: Car) => {
    try {
      await deleteCar(car.id);
      message.success(`Deleted ${car.registrationNumber}`);
      const wasLastOnPage = result?.data.length === 1 && (query.page ?? 1) > 1;
      if (wasLastOnPage) {
        updateQuery({ page: (query.page ?? 1) - 1 });
      } else {
        setReloadKey((key) => key + 1);
      }
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const handleTableChange: TableProps<Car>['onChange'] = (pagination, _filters, sorter) => {
    const { field, order } = Array.isArray(sorter) ? sorter[0] : sorter;
    const sortField = typeof field === 'string' && isSortField(field) && order ? field : undefined;

    updateQuery({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sortField,
      order: sortField ? (order === 'ascend' ? 'asc' : 'desc') : undefined,
    });
  };

  const sortOrderOf = (field: CarSortField): 'ascend' | 'descend' | null =>
    query.sortBy === field ? (query.order === 'asc' ? 'ascend' : 'descend') : null;

  const sortable = (field: CarSortField) => ({ sorter: true, sortOrder: sortOrderOf(field) });

  const columns: TableColumnsType<Car> = [
    {
      title: 'Registration No.',
      dataIndex: 'registrationNumber',
      ...sortable('registrationNumber'),
    },
    { title: 'Province', dataIndex: 'province', ...sortable('province') },
    { title: 'Brand', dataIndex: 'brand', ...sortable('brand') },
    { title: 'Model', dataIndex: 'model', ...sortable('model') },
    { title: 'Year', dataIndex: 'year', render: orDash, ...sortable('year') },
    { title: 'Color', dataIndex: 'color', render: orDash },
    { title: 'Notes', dataIndex: 'notes', ellipsis: true, render: orDash },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, car) => (
        <Flex gap="small" onClick={(event) => event.stopPropagation()}>
          <Button size="small" onClick={() => openForm(car)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this car?"
            description={`${car.registrationNumber} (${car.province}) will be removed.`}
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(car)}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Flex justify="space-between" align="center" wrap gap="middle">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Cars
        </Typography.Title>
        <Button type="primary" onClick={() => openForm(null)}>
          Add Car
        </Button>
      </Flex>

      <Flex gap="middle" wrap style={{ margin: '16px 0' }}>
        <Input.Search
          placeholder="Search registration no., province, brand, model, notes"
          allowClear
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onSearch={(value) => updateQuery({ search: value.trim() || undefined, page: 1 })}
          style={{ width: 400, maxWidth: '100%' }}
        />
        <Select
          placeholder="All brands"
          allowClear
          value={query.brand}
          options={brands.map((brand) => ({ label: brand, value: brand }))}
          showSearch={{ optionFilterProp: 'label' }}
          onChange={(brand?: string) => updateQuery({ brand, page: 1 })}
          style={{ width: 200 }}
        />
      </Flex>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={result?.data}
        loading={loading}
        onChange={handleTableChange}
        onRow={(car) => ({
          onClick: () => setDetailModal({ open: true, car }),
          style: { cursor: 'pointer' },
        })}
        scroll={{ x: 1000 }}
        pagination={{
          current: query.page,
          pageSize: query.pageSize,
          total: result?.meta.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `${total} car${total === 1 ? '' : 's'}`,
        }}
      />

      <CarDetailModal
        open={detailModal.open}
        car={detailModal.car}
        onClose={() => setDetailModal((current) => ({ ...current, open: false }))}
        onEdit={openForm}
      />

      <CarFormModal
        key={formModal.key}
        open={formModal.open}
        car={formModal.car}
        onClose={closeForm}
        onSaved={handleSaved}
      />
    </>
  );
}
