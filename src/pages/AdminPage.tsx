import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, DollarSign, FileText } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { logisticsCompanies } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Администрирование</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Логистические компании
              </h2>
            </div>

            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Название компании
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Базовая ставка ($/кг)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Условия
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Контакты
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logisticsCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{company.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-900">
                        <DollarSign className="w-4 h-4" />
                        <span>{company.baseRate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{company.conditions}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 space-y-1">
                        <p className="font-medium">{company.contactPerson}</p>
                        <p className="text-gray-600">{company.contactPhone}</p>
                        <p className="text-gray-600">{company.contactEmail}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Примечание:</strong> Это демо-версия административной панели. 
              В полной версии здесь будет возможность добавлять, редактировать и удалять 
              логистические компании, управлять их тарифами и условиями.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
