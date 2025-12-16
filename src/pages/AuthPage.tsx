import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogIn } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    
    // Проверяем, есть ли сохраненные данные из QuickCalculator
    const pendingData = localStorage.getItem('pendingQuickCalcData');
    if (pendingData) {
      // Очищаем сохраненные данные
      localStorage.removeItem('pendingQuickCalcData');
      // Перенаправляем на форму заявки с данными
      navigate('/application/new', {
        state: {
          fromQuickCalc: JSON.parse(pendingData)
        }
      });
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Добро пожаловать
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Войдите, чтобы создавать заявки и получать предложения
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ivan@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Войти / Зарегистрироваться
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Это демо-версия. Для входа достаточно указать любой email.
        </p>
      </div>
    </div>
  );
};
