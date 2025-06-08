'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UpdateDelete from './UpdateDeleteBuild';
import { message } from 'antd';

export default function ListBuilds({ buildings: initialBuildings, onBuildingAdded }) {
  const router = useRouter();
  const [buildings, setBuildings] = useState(initialBuildings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBuildings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/builds`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/');
          throw new Error('Unauthorized. Please log in again.');
        }
        throw new Error('Failed to fetch buildings');
      }

      const data = await response.json();
      setBuildings(data); 
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      message.error(err.message);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (onBuildingAdded) {
      setBuildings((prevBuildings) => [...prevBuildings, onBuildingAdded]);
    }
  }, [onBuildingAdded]);

  const handleBuildingClick = (building) => {
    setSelectedBuilding(building);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    fetchBuildings(); 
  };

  const handleDelete = () => {
    fetchBuildings(); 
  };

  if (loading) {
    return (
      <section className="p-6">
        <p className="text-lg text-center py-16">Загрузка...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="p-6">
        <p className="text-lg text-red-500 text-center py-16">Ошибка: {error}</p>
      </section>
    );
  }

  return (
    <section className="p-6 text-black">
      <h2 className="text-2xl font-bold mb-4">Список зданий</h2>
      {buildings.length === 0 ? (
        <p className="text-lg text-center">Нет зданий для отображения</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {buildings.map((building) => (
            <li
              key={building.id}
              className="border border-gray-200 rounded-lg p-4 mb-4 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
              onClick={() => handleBuildingClick(building)}
            >
              <h3 className="text-xl font-semibold mb-2">{building.name}</h3>
              <p className="text-base text-gray-600 my-1">
                <span className="font-medium">Уровень безопасности:</span>{' '}
                {building.security_level === 'high' ? 'Высокий' : building.security_level === 'medium' ? 'Средний' : 'Низкий'}
              </p>
              <p className="text-base text-gray-600 my-1">
                <span className="font-medium">Количество этажей:</span> {building.floor}
              </p>
              <p className="text-base text-gray-600 my-1">
                <span className="font-medium">Последняя проверка:</span>{' '}
                {new Date(building.last_check).toLocaleDateString('ru-RU')}
              </p>
            </li>
          ))}
        </ul>
      )}
      {selectedBuilding && (
        <UpdateDelete
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          building={selectedBuilding}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}