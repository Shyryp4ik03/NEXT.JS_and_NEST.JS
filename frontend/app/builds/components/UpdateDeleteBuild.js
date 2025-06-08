'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';

const { Option } = Select;

export default function UpdateDelete({ isModalOpen, setIsModalOpen, building, onUpdate, onDelete }) {
  const [form] = Form.useForm();
  const [lastInspection, setLastInspection] = useState(building?.last_check || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (building) {
      form.setFieldsValue({
        name: building.name,
        securityLevel: building.security_level,
        floors: building.floor,
        lastInspection: building.last_check ? new Date(building.last_check).toISOString().split('T')[0] : '',
      });
      setLastInspection(building.last_check ? new Date(building.last_check).toISOString().split('T')[0] : '');
    }
  }, [building, form]);

  const handleDateChange = (e) => {
    setLastInspection(e.target.value);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        lastInspection: lastInspection || null,
        floors: parseInt(values.floors, 10),
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/builds/${building.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update building: ${text}`);
      }

      message.success('Здание успешно обновлено');
      onUpdate();
      setIsModalOpen(false);
      form.resetFields();
      setLastInspection('');
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/builds/${building.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete building: ${text}`);
      }

      message.success('Здание успешно удалено');
      onDelete();
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setLastInspection('');
  };

  return (
    <Modal
      title="Редактировать или удалить здание"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="delete" danger type="primary" onClick={handleDelete} loading={loading}>
          Удалить
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate} loading={loading}>
          Обновить
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="update_building_form">
        <Form.Item
          name="name"
          label="Название здания"
          rules={[{ required: true, message: 'Пожалуйста, введите название здания!' }]}
        >
          <Input placeholder="Введите название здания" />
        </Form.Item>
        <Form.Item
          name="securityLevel"
          label="Уровень безопасности"
          rules={[{ required: true, message: 'Пожалуйста, выберите уровень безопасности!' }]}
        >
          <Select placeholder="Выберите уровень безопасности">
            <Option value="high">Высокий</Option>
            <Option value="medium">Средний</Option>
            <Option value="low">Низкий</Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Последняя проверка"
          name="lastInspection"
          rules={[{ required: true, message: 'Пожалуйста, выберите дату последней проверки!' }]}
        >
          <Input
            type="date"
            name="lastInspection"
            value={lastInspection}
            onChange={handleDateChange}
            required
            style={{ width: '100%', padding: '4px', borderRadius: '4px', border: '1px solid #d9d9d9' }}
          />
        </Form.Item>
        <Form.Item
          name="floors"
          label="Количество этажей"
          rules={[
            { required: true, message: 'Пожалуйста, введите количество этажей!' },
            {
              validator: (_, value) =>
                !value || parseInt(value, 10) >= 1
                  ? Promise.resolve()
                  : Promise.reject(new Error('Количество этажей должно быть положительным числом!')),
            },
          ]}
        >
          <Input type="number" placeholder="Введите количество этажей" min="1" />
        </Form.Item>
      </Form>
    </Modal>
  );
}