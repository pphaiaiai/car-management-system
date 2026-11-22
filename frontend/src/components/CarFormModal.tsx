import { App, AutoComplete, Form, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

import { createCar, listBrands, updateCar } from '../api/cars';
import { getErrorMessage, getFieldErrors } from '../api/client';
import { THAI_PROVINCES } from '../constants/provinces';
import type { Car, CarInput } from '../types/car';

const MAX_YEAR = new Date().getFullYear() + 1;
const PLATE_PATTERN = /^\s*[1-9]?[ก-ฮ]{1,2}\s*[1-9][0-9]{0,3}\s*$/;

const provinceOptions = THAI_PROVINCES.map((province) => ({ label: province, value: province }));

interface CarFormModalProps {
  open: boolean;
  car: Car | null;
  onClose: () => void;
  onSaved: (car: Car) => void;
}

export function CarFormModal({ open, car, onClose, onSaved }: CarFormModalProps) {
  const [form] = Form.useForm<CarInput>();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);
  const isEdit = car !== null;

  useEffect(() => {
    if (!open) return;
    listBrands()
      .then(setBrands)
      .catch(() => setBrands([]));
  }, [open]);

  const handleFinish = async (values: CarInput) => {
    setSubmitting(true);
    try {
      const saved = isEdit ? await updateCar(car.id, values) : await createCar(values);
      message.success(`${isEdit ? 'Saved' : 'Added'} ${saved.registrationNumber}`);
      onSaved(saved);
    } catch (error) {
      const fieldErrors = getFieldErrors(error);
      if (fieldErrors.length > 0) {
        form.setFields(
          fieldErrors.map(({ name, errors }) => ({ name: name as keyof CarInput, errors })),
        );
      } else {
        message.error(getErrorMessage(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      centered
      open={open}
      title={isEdit ? 'Edit car' : 'Add car'}
      okText={isEdit ? 'Save changes' : 'Add car'}
      okButtonProps={{ htmlType: 'submit' }}
      confirmLoading={submitting}
      onCancel={onClose}
      mask={{ closable: false }}
      destroyOnHidden
      modalRender={(dialog) => (
        <Form
          form={form}
          layout="vertical"
          initialValues={car ?? undefined}
          onFinish={handleFinish}
          disabled={submitting}
        >
          {dialog}
        </Form>
      )}
    >
      <Form.Item
        label="Registration number"
        name="registrationNumber"
        rules={[
          { required: true, whitespace: true, message: 'Please enter the registration number' },
          { max: 20, message: 'At most 20 characters' },
          { pattern: PLATE_PATTERN, message: 'Must look like "1กข 1234" or "กข 1234"' },
        ]}
      >
        <Input placeholder="e.g. 1กข 1234" />
      </Form.Item>

      <Form.Item
        label="Province"
        name="province"
        rules={[{ required: true, message: 'Please select the province' }]}
      >
        <Select
          placeholder="Select province"
          options={provinceOptions}
          showSearch={{ optionFilterProp: 'label' }}
        />
      </Form.Item>

      <Form.Item
        label="Brand"
        name="brand"
        rules={[
          { required: true, whitespace: true, message: 'Please enter the brand' },
          { max: 50, message: 'At most 50 characters' },
        ]}
      >
        <AutoComplete
          placeholder="e.g. Toyota"
          options={brands.map((brand) => ({ value: brand }))}
          showSearch={{
            filterOption: (input, option) =>
              String(option?.value ?? '')
                .toLowerCase()
                .includes(input.toLowerCase()),
          }}
        />
      </Form.Item>

      <Form.Item
        label="Model"
        name="model"
        rules={[
          { required: true, whitespace: true, message: 'Please enter the model' },
          { max: 100, message: 'At most 100 characters' },
        ]}
      >
        <Input placeholder="e.g. Yaris Ativ" />
      </Form.Item>

      <Form.Item label="Year" name="year">
        <InputNumber
          placeholder={`1900 – ${MAX_YEAR}`}
          min={1900}
          max={MAX_YEAR}
          precision={0}
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item label="Color" name="color" rules={[{ max: 30, message: 'At most 30 characters' }]}>
        <Input placeholder="e.g. White" />
      </Form.Item>

      <Form.Item label="Notes" name="notes">
        <Input.TextArea rows={3} maxLength={1000} showCount />
      </Form.Item>
    </Modal>
  );
}
