'use client';
import { useRouter } from 'next/navigation';
import { CiLogout } from 'react-icons/ci';
import { useState } from 'react';
import { message } from 'antd';

export default function ItemAuthorization() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [saveError, setSaveError] = useState(null);

  const handleAuthorization = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: login, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const { access_token } = await response.json();
      localStorage.setItem('token', access_token);
      message.success('Успешный вход');
      router.push('/builds');
    } catch (error) {
      setSaveError(error.message);
      message.error(error.message);
    }
  };

  return (
    <section>
      <div className="flex justify-center flex-col items-center h-screen text-black">
        <div className="bg-[#8595db] w-[400px] h-[320px] rounded-3xl">
          <div className="flex justify-center">
            <button onClick={() => router.push('/#homepage')}>
              <img src="/favicon.png" alt="Лого" className="img-logoautho" />
            </button>
          </div>
          <h1 className="textMedium text-center">Авторизация</h1>
          <div className="flex flex-col justify-center">
            <input
              type="text"
              name="login"
              placeholder="Логин"
              className="rounded-xl h-[40px] w-[230px] mx-auto my-[10px] p-[5px] border border-black"
              onChange={(event) => setLogin(event.target.value)}
              value={login}
            />
            <input
              type="password"
              name="password"
              className="rounded-xl h-[40px] w-[230px] mx-auto my-[10px] p-[5px] border border-black"
              placeholder="Пароль"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          </div>
          {saveError && <p className="text-red-500 text-center">{saveError}</p>}
          <div className="flex justify-center flex-col">
            <button
              onClick={handleAuthorization}
              className="btn-autho mx-auto mt-[15px] flex flex-nowrap group"
            >
              <p className="group-hover:text-white">Войти</p>
              <CiLogout className="text-2xl text-gray-600 ml-[3px] group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}