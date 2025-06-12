'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Spin, Alert, Typography, message, Input } from 'antd';
import UpdateDeleteResident from './UpdateDeleteResidents';

const { Title } = Typography;
const { Search } = Input;

export default function ListResidents({ residents: initialResidents, onResidentAdded, onResidentDeleted }) {
  const router = useRouter();
  const [residents, setResidents] = useState(initialResidents || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedResident, setSelectedResident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setResidents(initialResidents || []);
  }, [initialResidents]);

  useEffect(() => {
    if (onResidentAdded) {
      setResidents((prevResidents) => [...prevResidents, onResidentAdded]);
    }
  }, [onResidentAdded]);

  useEffect(() => {
    if (onResidentDeleted) {
      setResidents((prevResidents) => prevResidents.filter(resident => resident.id !== onResidentDeleted));
    }
  }, [onResidentDeleted]);

  const handleResidentClick = (resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
  };

  const handleDelete = (id) => {
  };

  const filteredResidents = residents.filter(resident => {
    const fullName = resident.fullName || '';
    const apartment = resident.data?.apartment || '';
    const pinCode = resident.data?.pinCode || '';
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      apartment.toLowerCase().includes(searchLower) ||
      pinCode.toLowerCase().includes(searchLower)
    );
  });

  const columns = [
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Квартира',
      dataIndex: ['data', 'apartment'],
      key: 'apartment',
      sorter: (a, b) => a.data?.apartment.localeCompare(b.data?.apartment),
    },
    {
      title: 'ПИН-код',
      dataIndex: ['data', 'pinCode'],
      key: 'pinCode',
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" tip="Загрузка..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert message="Ошибка" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 16 }}>Список жителей</Title>
      <Search
        placeholder="Поиск по ФИО, квартире или ПИН-коду"
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
        allowClear
      />
      <Table
        columns={columns}
        dataSource={filteredResidents.map(resident => ({
          ...resident,
          key: resident.id || `resident-${Date.now()}-${Math.random()}`
        }))}
        onRow={(record) => ({
          onClick: () => handleResidentClick(record),
        })}
        locale={{ emptyText: 'Нет жителей для отображения' }}
        pagination={{ pageSize: 5 }}
        rowClassName="cursor-pointer"
      />
      {selectedResident && (
        <UpdateDeleteResident
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          resident={selectedResident}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}