'use client';
import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { LockOutlined, HomeOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

export default function Main() {
  const [pin, setPin] = useState('');
  const [aptNumber, setAptNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [doorStatus, setDoorStatus] = useState(null);

  const handleNumberClick = (number) => {
    if (pin.length < 4 && !loading) {
      setPin(pin + number);
    }
  };

  const handleClear = () => {
    if (!loading) {
      setPin('');
      setAptNumber('');
      setDoorStatus(null);
    }
  };

  const handleSubmit = async () => {
    if (!aptNumber.trim()) {
      setDoorStatus('Введите номер квартиры');
      return;
    }
    if (pin.length !== 4) {
      setDoorStatus('ПИН-код должен состоять из 4 цифр');
      return;
    }

    setLoading(true);
    setDoorStatus(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Не авторизован. Пожалуйста, войдите.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/residents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении данных');
      }

      const residents = await response.json();
      const validResident = residents.find(
        (resident) => resident.data?.apartment === aptNumber && resident.data?.pinCode === pin
      );

      if (validResident) {
        setDoorStatus('Дверь открыта!');
      } else {
        setDoorStatus('Дверь закрыта! Неверные данные!');
      }
    } catch (error) {
      setDoorStatus('Дверь закрыта! Неверные данные!');
      console.error('Error in handleSubmit:', error);
    } finally {
      setLoading(false);
      if (doorStatus === 'Дверь открыта!') {
        setPin('');
        setAptNumber('');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <LockOutlined className="text-2xl text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Вход в подъезд</h1>
        </div>

        <div className="mb-6">
          <Input
            prefix={<HomeOutlined className="text-gray-400" />}
            value={aptNumber}
            onChange={(e) => setAptNumber(e.target.value)}
            placeholder="Номер квартиры"
            className="rounded-lg text-center text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
            disabled={loading}
          />
        </div>

        <div className="mb-6">
          <Input
            prefix={<LockOutlined className="text-gray-400" />}
            value={pin}
            placeholder="ПИН-код"
            className="rounded-lg text-center text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
            maxLength={4}
            disabled
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0].map((item) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white rounded-lg p-4 text-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-300"
              onClick={() => (item === 'C' ? handleClear() : handleNumberClick(item.toString()))}
              disabled={loading}
            >
              {item}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-green-500 text-white rounded-lg py-3 text-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Проверка...' : 'Проверить'}
        </motion.button>

        <AnimatePresence>
          {doorStatus && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 text-center text-lg font-semibold ${
                doorStatus === 'Дверь открыта!'
                  ? 'text-green-600'
                  : doorStatus === 'Неверные данные!'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              {doorStatus}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}