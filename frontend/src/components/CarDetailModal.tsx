import { Button, Descriptions, Modal } from 'antd';
import type { DescriptionsProps } from 'antd';

import type { Car } from '../types/car';

interface CarDetailModalProps {
  open: boolean;
  car: Car | null;
  onClose: () => void;
  onEdit: (car: Car) => void;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

export function CarDetailModal({ open, car, onClose, onEdit }: CarDetailModalProps) {
  const items: DescriptionsProps['items'] = car
    ? [
        { label: 'Registration number', children: car.registrationNumber },
        { label: 'Province', children: car.province },
        { label: 'Brand', children: car.brand },
        { label: 'Model', children: car.model },
        { label: 'Year', children: car.year ?? '-' },
        { label: 'Color', children: car.color ?? '-' },
        {
          label: 'Notes',
          children: <span style={{ whiteSpace: 'pre-wrap' }}>{car.notes ?? '-'}</span>,
        },
        { label: 'Created', children: formatDate(car.createdAt) },
        { label: 'Last updated', children: formatDate(car.updatedAt) },
      ]
    : [];

  return (
    <Modal
      open={open}
      centered
      title="Car details"
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button key="edit" type="primary" onClick={() => car && onEdit(car)}>
          Edit
        </Button>,
      ]}
    >
      <Descriptions column={1} bordered size="small" items={items} />
    </Modal>
  );
}
