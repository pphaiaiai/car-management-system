import { App, Table, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import { useEffect, useState } from 'react';

import { listCars } from '../api/cars';
import { getErrorMessage } from '../api/client';
import type { Car } from '../types/car';

const orDash = (value: string | number | null) => value ?? '-';

const columns: TableColumnsType<Car> = [
  { title: 'Registration No.', dataIndex: 'registrationNumber' },
  { title: 'Province', dataIndex: 'province' },
  { title: 'Brand', dataIndex: 'brand' },
  { title: 'Model', dataIndex: 'model' },
  { title: 'Year', dataIndex: 'year', render: orDash },
  { title: 'Color', dataIndex: 'color', render: orDash },
  { title: 'Notes', dataIndex: 'notes', ellipsis: true, render: orDash },
];

export function CarListPage() {
  const { message } = App.useApp();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    listCars()
      .then((result) => {
        if (!ignore) setCars(result.data);
      })
      .catch((error: unknown) => {
        if (!ignore) message.error(getErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [message]);

  return (
    <>
      <Typography.Title level={3}>Cars</Typography.Title>
      <Table rowKey="id" columns={columns} dataSource={cars} loading={loading} />
    </>
  );
}
