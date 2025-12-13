import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getCertificationRequirements, calculateCostEstimation, generateLogisticsOffers } from '../data/mockData';
import { Package, FileText, DollarSign, Truck, CheckCircle, Phone, Mail } from 'lucide-react';

export const ApplicationViewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApplicationById, updateApplication, logisticsCompanies } = useApp();
  
  const application = getApplicationById(id!);
  const [selectedOfferId, setSelectedOfferId] = useState(application?.selectedOfferId);

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Заявка не найдена</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            Вернуться к списку заявок
          </button>
        </div>
      </div>
    );
  }

  const costEstimation = calculateCostEstimation(
    application.weight,
    application.volume,
    application.productCost,
    application.originCity,
    application.destinationCity
  );
  const offers = generateLogisticsOffers(
    application.id,
    application.weight,
    application.volume,
    application.productCost,
    application.needMarketplaceDelivery
  );

  const handleSelectOffer = (offerId: string) => {
    setSelectedOfferId(offerId);
    updateApplication(application.id, {
      status: 'in_progress',
      selectedOfferId: offerId,
    });
  };

  const selectedOffer = offers.find(o => o.id === selectedOfferId);
  const selectedCompany = selectedOffer ? logisticsCompanies.find(c => c.id === selectedOffer.companyId) : null;

  const uniqueTnvedCodes = [...new Set(application.products.map(p => p.tnvedCode))];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-6"
          >
            ← Вернуться к заявкам
          </button>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Заявка #{application.id}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    application.status === 'completed' ? 'bg-green-100 text-green-700' :
                    application.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                    application.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {application.status === 'completed' ? 'Завершена' :
                     application.status === 'in_progress' ? 'В работе' :
                     application.status === 'sent' ? 'Отправлена' : 'Черновик'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Товары в заявке</h3>
                    <div className="space-y-3">
                      {application.products.map((product, index) => (
                        <div key={product.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{index + 1}. {product.productName}</h4>
                            <span className="text-sm text-gray-600">{product.quantity} шт</span>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Материал:</span> {product.productMaterial}</p>
                            <p><span className="font-medium">Описание:</span> {product.productDescription}</p>
                            <p><span className="font-medium">Код ТН ВЭД:</span> <span className="font-mono">{product.tnvedCode}</span></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Вес</h3>
                      <p className="text-gray-900">{application.weight} кг</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Объём</h3>
                      <p className="text-gray-900">{application.volume} м³</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Стоимость</h3>
                      <p className="text-gray-900">${application.productCost}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Incoterms</h3>
                      <p className="text-gray-900">{application.incoterms}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Маршрут</h3>
                    <p className="text-gray-900">
                      {application.originCity} → {application.destinationCity}
                    </p>
                    {application.needMarketplaceDelivery && (
                      <p className="text-sm text-gray-600 mt-1">
                        Доставка до склада {application.marketplace === 'ozon' ? 'OZON' : 
                                           application.marketplace === 'wildberries' ? 'Wildberries' : 
                                           'маркетплейса'}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Контакты</h3>
                    <div className="space-y-1 text-sm text-gray-900">
                      <p>{application.contactName}</p>
                      <p>{application.contactPhone}</p>
                      <p>{application.contactEmail}</p>
                      {application.contactTelegram && <p>{application.contactTelegram}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Требования по сертификации
                  </h2>
                </div>
                
                {uniqueTnvedCodes.map((tnvedCode) => {
                  const certRequirements = getCertificationRequirements(tnvedCode);
                  const productsWithCode = application.products.filter(p => p.tnvedCode === tnvedCode);
                  
                  return (
                    <div key={tnvedCode} className="mb-6 last:mb-0">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Код ТН ВЭД: {tnvedCode}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Товары: {productsWithCode.map(p => p.productName).join(', ')}
                      </p>
                      <ul className="space-y-2 mb-3">
                        {certRequirements.requirements.map((req, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        {certRequirements.additionalInfo}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Ориентировочный расчёт
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Доставка:</span>
                    <span className="font-medium text-gray-900">
                      ${costEstimation.deliveryCostMin} - ${costEstimation.deliveryCostMax}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Таможенная пошлина (10%):</span>
                    <span className="font-medium text-gray-900">${costEstimation.customsDuty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">НДС (20%):</span>
                    <span className="font-medium text-gray-900">${costEstimation.vat}</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between">
                    <span className="font-semibold text-gray-900">Итого ориентировочно:</span>
                    <span className="font-bold text-lg text-gray-900">
                      ${costEstimation.totalMin} - ${costEstimation.totalMax}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  {costEstimation.notes}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Предложения логистических компаний
                  </h2>
                </div>
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className={`border-2 rounded-lg p-4 transition ${
                        selectedOfferId === offer.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{offer.companyName}</h3>
                        <span className="font-bold text-lg text-gray-900">${offer.cost}</span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p>Срок доставки: {offer.deliveryTime}</p>
                        <p>{offer.conditions}</p>
                      </div>
                      {selectedOfferId === offer.id ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Предложение выбрано
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectOffer(offer.id)}
                          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                          Выбрать предложение
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {selectedOffer && selectedCompany && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-sm p-6 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Вы выбрали: {selectedCompany.name}
                    </h2>
                  </div>
                  <p className="text-gray-700 mb-4">
                    С вами свяжется менеджер для финального согласования деталей.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{selectedCompany.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4" />
                      <a href={`tel:${selectedCompany.contactPhone}`} className="hover:text-blue-600">
                        {selectedCompany.contactPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      <a href={`mailto:${selectedCompany.contactEmail}`} className="hover:text-blue-600">
                        {selectedCompany.contactEmail}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
