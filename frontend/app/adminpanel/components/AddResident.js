'use client';
import React from 'react';
import { Modal, Form, Input, notification } from 'antd';

export default function AddResident({ isModalOpen, setIsModalOpen, handleCancel, onResidentAdded }) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        fullName: values.fullName,
        apartment: values.apartment,
        pinCode: values.pinCode,
      };
      console.log('Sending data to API:', formattedValues);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/residents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedValues),
      });

      console.log('API Response Status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.error('API Error Response:', text);
        const errorData = JSON.parse(text);
        if (errorData.statusCode === 400 && errorData.message === 'Pin code already exists') {
          throw new Error('ПИН-код уже используется. Пожалуйста, выберите другой.');
        }
        throw new Error(`Failed to create resident: ${text || 'Unknown error'}`);
      }

      const newResident = await response.json();
      console.log('New Resident from API:', newResident);
      notification.success({
        message: 'Успех',
        description: `Житель ${newResident.fullName} успешно добавлен!`,
        placement: 'topRight',
      });
      setIsModalOpen(false);
      form.resetFields();
      if (onResidentAdded) {
        onResidentAdded(newResident);
      }
    } catch (error) {
      console.error('Error in handleOk:', error);
      notification.error({
        message: 'Ошибка',
        description: error.message,
        placement: 'topRight',
      });
    }
  };

  return (
    <section>
      <Modal
        title="Добавить нового жителя"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" name="add_resident_form">
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
    </section>
  );
}