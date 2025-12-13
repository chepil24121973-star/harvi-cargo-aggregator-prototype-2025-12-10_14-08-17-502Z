import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, FileText, Clock, CheckCircle, Send } from 'lucide-react';

const statusConfig = {
  draft: { label: 'Черновик', icon: FileText, color: 'text-gray-600 bg-gray-100' },
  sent: { label: 'Отправлена логистам', icon: Send, color: 'text-blue-600 bg-blue-100' },
  in_progress: { label: 'В работе', icon: Clock, color: 'text-orange-600 bg-orange-100' },
  completed: { label: 'Завершена', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { applications } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Мои заявки</h1>
            <button
              onClick={() => navigate('/application/new')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-5 h-5" />
              Создать новую заявку
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Номер
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Дата
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Товары
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Маршрут
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => {
                  const status = statusConfig[app.status];
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={app.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{app.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {app.products.length === 1 
                          ? app.products[0].productName
                          : `${app.products.length} товаров`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {app.originCity} → {app.destinationCity}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/application/${app.id}`)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Открыть
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {applications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">У вас пока нет заявок</p>
                <button
                  onClick={() => navigate('/application/new')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Создать первую заявку
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
