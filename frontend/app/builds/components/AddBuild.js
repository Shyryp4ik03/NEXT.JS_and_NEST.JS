'use client';
import React, { useState } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;

export default function AddBuild({ isModalOpen, setIsModalOpen, handleCancel, onBuildingAdded }) {
  const [form] = Form.useForm();
  const [lastInspection, setLastInspection] = useState('');

  const handleDateChange = (e) => {
    setLastInspection(e.target.value);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        lastInspection: lastInspection || null,
        floors: parseInt(values.floors, 10),
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/builds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to create building: ${text}`);
      }

      const newBuilding = await response.json(); 
      message.success('Здание успешно добавлено');
      setIsModalOpen(false);
      form.resetFields();
      setLastInspection('');
      if (onBuildingAdded) {
        onBuildingAdded(newBuilding); 
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <section>
      <Modal
        title="Добавить новое здание"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" name="add_building_form">
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
    </section>
  );
}