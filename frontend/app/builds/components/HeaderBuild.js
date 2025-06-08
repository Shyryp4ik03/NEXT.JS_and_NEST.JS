'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Menu } from 'antd';
import { HomeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import AddBuild from './AddBuild';

const { Header } = Layout;

export default function HeaderBuild() {
  const router = useRouter();
  const [current, setCurrent] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    setCurrent('addbuild');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setCurrent('home');
  };

  const menuItems = [

    {
      label: (
        <span onClick={showModal}>
          Добавить здание
        </span>
      ),
      key: 'addbuild',
      icon: <PlusCircleOutlined />,
    },
  ];

  return (
    <>
      <Header className="flex items-center justify-between px-6 bg-white shadow-md fixed w-full z-50">
        <div className="text-2xl font-bold text-[#1890ff] p-2">
          <span>Безопасность зданий и сооружений</span>
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[current]}
          items={menuItems}
          className="flex-1 justify-end bg-transparent [&_.ant-menu-item]:text-base [&_.ant-menu-item]:px-5 [&_.ant-menu-item:hover]:text-[#1890ff]"
        />
      </Header>
      <AddBuild
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleCancel={handleCancel}
      />
    </>
  );
}