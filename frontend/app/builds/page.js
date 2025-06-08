'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ListBuilds from './components/ListBuilds';
import AddBuild from './components/AddBuild';
import { Button, message } from 'antd';

export default function BuildsPage() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [buildings, setBuildings] = useState([]); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Вы вышли из системы');
    router.push('/');
  };

  const handleBuildingAdded = (newBuilding) => {
    setBuildings((prevBuildings) => [...prevBuildings, newBuilding]); 
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Управление зданиями</h1>
        <div>
          <Button type="primary" onClick={() => setIsAddModalOpen(true)} className="mr-2">
            Добавить здание
          </Button>
          <Button onClick={handleLogout}>Выйти</Button>
        </div>
      </div>
      <ListBuilds buildings={buildings} onBuildingAdded={handleBuildingAdded} />
      <AddBuild
        isModalOpen={isAddModalOpen}
        setIsModalOpen={setIsAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        onBuildingAdded={handleBuildingAdded}
      />
    </div>
  );
}