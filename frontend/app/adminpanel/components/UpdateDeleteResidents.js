'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

export default function UpdateDeleteResident({ isModalOpen, setIsModalOpen, resident, onUpdate, onDelete }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resident) {
      form.setFieldsValue({
        fullName: resident.fullName,
        apartment: resident.data?.apartment || '',
        pinCode: resident.data?.pinCode || '',
      });
    }
  }, [resident, form]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const formattedValues = {
        fullName: values.fullName,
        apartment: values.apartment,
        pinCode: values.pinCode,
      };

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/residents/${resident.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedValues),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to update resident: ${text}`);
      }

      message.success('Житель успешно обновлен');
      onUpdate();
      setIsModalOpen(false);
      form.resetFields();
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/residents/${resident.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete resident: ${text}`);
      }

      message.success('Житель успешно удален');
      onDelete(resident.id);
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
  };

  return (
    <Modal
      title="Редактировать или удалить жителя"
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
      <Form form={form} layout="vertical" name="update_resident_form">
        <Form.Item
          name="fullName"
          label="ФИО"
          rules={[{ required: true, message: 'Пожалуйста, введите ФИО!' }]}
        >
          <Input placeholder="Введите ФИО" />
        </Form.Item>
        <Form.Item
          name="apartment"
          label="Номер квартиры"
          rules={[{ required: true, message: 'Пожалуйста, введите номер квартиры!' }]}
        >
          <Input placeholder="Введите номер квартиры" />
        </Form.Item>
        <Form.Item
          name="pinCode"
          label="ПИН-код"
          rules={[
            { required: true, message: 'Пожалуйста, введите ПИН-код!' },
            { pattern: /^[0-9]{4}$/, message: 'ПИН-код должен состоять из 4 цифр!' },
          ]}
        >
          <Input placeholder="Введите 4-значный ПИН-код" maxLength={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}