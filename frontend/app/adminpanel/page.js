'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResidentsList from './components/ResidentsList';
import AddResident from './components/AddResident';
import { Button, message } from 'antd';

export default function ResidentsPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/residents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch residents');
        const data = await response.json();
        console.log('Fetched residents:', data);
        setResidents(data);
      } catch (error) {
        console.error('Error fetching residents:', error);
        message.error('Не удалось загрузить список жителей');
      }
    };

    fetchResidents();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Вы вышли из системы');
    router.push('/');
  };

  const handleResidentAdded = (newResident) => {
    setResidents((prevResidents) => [...prevResidents, newResident]);
  };

  const handleResidentDeleted = (residentId) => {
    setResidents((prevResidents) => prevResidents.filter(resident => resident.id !== residentId));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Список жителей</h1>
        <div>
          <Button type="primary" onClick={() => setIsAddModalOpen(true)} className="mr-2">
            Добавить жителя
          </Button>
          <Button onClick={handleLogout}>Выйти</Button>
        </div>
      </div>
      <ResidentsList
        residents={residents}
        onResidentAdded={handleResidentAdded}
        onResidentDeleted={handleResidentDeleted}
      />
      <AddResident
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        onResidentAdded={handleResidentAdded}
      />
    </div>
  );
}