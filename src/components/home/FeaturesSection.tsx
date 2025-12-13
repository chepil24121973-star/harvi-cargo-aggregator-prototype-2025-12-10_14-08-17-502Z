import React from 'react';
import { Shield, TrendingUp, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
        Преимущества работы с нами
      </h2>
      
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Белая доставка
          </h3>
          <p className="text-gray-600">
            Все документы, таможенное оформление и сертификация по требованиям ЕАЭС
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Лучшие предложения
          </h3>
          <p className="text-gray-600">
            Сравниваем цены от проверенных логистических компаний
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Быстро и удобно
          </h3>
          <p className="text-gray-600">
            Создавайте заявки онлайн и получайте предложения в течение 24 часов
          </p>
        </div>
      </div>
    </section>
  );
};
