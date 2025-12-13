import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getTNVEDSuggestions } from '../data/mockData';
import { Sparkles, Package, DollarSign, MapPin, User as UserIcon, Info, Plus, Trash2 } from 'lucide-react';
import { TNVEDSuggestion, Product } from '../types';

export const ApplicationFormPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addApplication, user } = useApp();
  
  const quickCalcData = location.state?.fromQuickCalc;
  
  const [products, setProducts] = useState<Partial<Product>[]>([
    {
      productName: quickCalcData?.productDescription || '',
      productMaterial: '',
      productDescription: quickCalcData?.productDescription || '',
      tnvedCode: '',
      quantity: 0,
    },
  ]);

  const [formData, setFormData] = useState({
    weight: quickCalcData?.weight || '',
    length: '',
    width: '',
    height: '',
    volume: '',
    productCost: quickCalcData?.productCost || '',
    incoterms: 'EXW',
    originCity: quickCalcData?.originCity || 'Гуанчжоу',
    destinationCity: quickCalcData?.destinationCity || 'Москва',
    needMarketplaceDelivery: false,
    marketplace: 'ozon' as 'ozon' | 'wildberries' | 'other',
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
    contactTelegram: user?.telegram || '',
  });

  const [tnvedSuggestions, setTnvedSuggestions] = useState<TNVEDSuggestion[]>([]);
  const [showTnvedModal, setShowTnvedModal] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState<number>(0);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        productName: '',
        productMaterial: '',
        productDescription: '',
        tnvedCode: '',
        quantity: 0,
      },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const handleProductChange = (index: number, field: keyof Product, value: any) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const handleTNVEDSuggest = (index: number) => {
    const product = products[index];
    const suggestions = getTNVEDSuggestions(
      product.productName || '',
      product.productMaterial || '',
      product.productDescription || ''
    );
    setTnvedSuggestions(suggestions);
    setCurrentProductIndex(index);
    setShowTnvedModal(true);
  };

  const handleSelectTNVED = (code: string) => {
    handleProductChange(currentProductIndex, 'tnvedCode', code);
    setShowTnvedModal(false);
  };

  const calculateVolume = () => {
    const l = parseFloat(formData.length) || 0;
    const w = parseFloat(formData.width) || 0;
    const h = parseFloat(formData.height) || 0;
    const volume = (l * w * h) / 1000000;
    setFormData({ ...formData, volume: volume.toFixed(3) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      if (!product.tnvedCode) {
        alert(`Товар ${i + 1}: Пожалуйста, укажите код ТН ВЭД или используйте AI-подбор`);
        return;
      }
      if (!product.productName || !product.productMaterial || !product.productDescription) {
        alert(`Товар ${i + 1}: Заполните все обязательные поля`);
        return;
      }
    }
    
    const newApp = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'sent' as const,
      products: products.map((p, i) => ({
        id: `${Date.now()}-${i}`,
        productName: p.productName!,
        productMaterial: p.productMaterial!,
        productDescription: p.productDescription!,
        tnvedCode: p.tnvedCode!,
        quantity: p.quantity || 0,
      })),
      weight: parseFloat(formData.weight),
      volume: parseFloat(formData.volume),
      productCost: parseFloat(formData.productCost),
      incoterms: formData.incoterms,
      originCity: formData.originCity,
      destinationCity: formData.destinationCity,
      needMarketplaceDelivery: formData.needMarketplaceDelivery,
      marketplace: formData.needMarketplaceDelivery ? formData.marketplace : undefined,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      contactTelegram: formData.contactTelegram,
    };
    
    addApplication(newApp);
    navigate(`/application/${newApp.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Создание заявки</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Package className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Товары</h2>
                </div>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Добавить товар
                </button>
              </div>

              {products.map((product, index) => (
                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Товар {index + 1}</h3>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название товара
                      </label>
                      <input
                        type="text"
                        value={product.productName || ''}
                        onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Материал
                      </label>
                      <input
                        type="text"
                        value={product.productMaterial || ''}
                        onChange={(e) => handleProductChange(index, 'productMaterial', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: пластик ABS, хлопок, нержавеющая сталь"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Описание
                      </label>
                      <textarea
                        value={product.productDescription || ''}
                        onChange={(e) => handleProductChange(index, 'productDescription', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Что это за товар, для чего используется"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Код ТН ВЭД
                        </label>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={product.tnvedCode || ''}
                              onChange={(e) => handleProductChange(index, 'tnvedCode', e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="9503006100"
                            />
                            <button
                              type="button"
                              onClick={() => handleTNVEDSuggest(index)}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                              <Sparkles className="w-5 h-5" />
                              AI
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span>Если вы знаете код ТН ВЭД - введите его вручную. Если нет - используйте AI-подбор</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Количество (шт)
                        </label>
                        <input
                          type="number"
                          value={product.quantity || ''}
                          onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Коммерческие параметры</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Вес брутто (кг)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Стоимость товара (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.productCost}
                    onChange={(e) => setFormData({ ...formData, productCost: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Расчет объема</p>
                        <p>Введите габариты груза (длина, ширина, высота) - объем рассчитается автоматически. Или укажите объем напрямую, если знаете его.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Длина (см)
                  </label>
                  <input
                    type="number"
                    value={formData.length}
                    onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                    onBlur={calculateVolume}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ширина (см)
                  </label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    onBlur={calculateVolume}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Высота (см)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    onBlur={calculateVolume}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="60"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Объём (м³) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
                    placeholder="2.5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Условия поставки (Incoterms)
                  </label>
                  <select
                    value={formData.incoterms}
                    onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EXW">EXW</option>
                    <option value="FOB">FOB</option>
                    <option value="CIF">CIF</option>
                    <option value="DDP">DDP</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-6 h-6 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">Маршрут</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Город отправления в Китае
                    </label>
                    <select
                      value={formData.originCity}
                      onChange={(e) => setFormData({ ...formData, originCity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Гуанчжоу</option>
                      <option>Шанхай</option>
                      <option>Иу</option>
                      <option>Шэньчжэнь</option>
                      <option>Пекин</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Город назначения в России
                    </label>
                    <select
                      value={formData.destinationCity}
                      onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Москва</option>
                      <option>Санкт-Петербург</option>
                      <option>Новосибирск</option>
                      <option>Екатеринбург</option>
                      <option>Казань</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.needMarketplaceDelivery}
                      onChange={(e) => setFormData({ ...formData, needMarketplaceDelivery: e.target.checked })}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Нужна доставка до склада маркетплейса
                    </span>
                  </label>
                </div>

                {formData.needMarketplaceDelivery && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Маркетплейс
                    </label>
                    <select
                      value={formData.marketplace}
                      onChange={(e) => setFormData({ ...formData, marketplace: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ozon">OZON</option>
                      <option value="wildberries">Wildberries</option>
                      <option value="other">Другое</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <UserIcon className="w-6 h-6 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Контактные данные</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя контактного лица
                  </label>
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram (необязательно)
                  </label>
                  <input
                    type="text"
                    value={formData.contactTelegram}
                    onChange={(e) => setFormData({ ...formData, contactTelegram: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@username"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Отменить
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Рассчитать и отправить логистам
              </button>
            </div>
          </form>
        </div>
      </div>

      {showTnvedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Предложенные коды ТН ВЭД</h3>
            </div>

            <div className="space-y-3">
              {tnvedSuggestions.map((suggestion) => (
                <div
                  key={suggestion.code}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition cursor-pointer"
                  onClick={() => handleSelectTNVED(suggestion.code)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-lg font-mono font-semibold text-gray-900">
                      {suggestion.code}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      suggestion.confidence === 'high' ? 'bg-green-100 text-green-700' :
                      suggestion.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {suggestion.confidence === 'high' ? 'Высокая' :
                       suggestion.confidence === 'medium' ? 'Средняя' : 'Низкая'} уверенность
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{suggestion.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTnvedModal(false)}
              className="w-full mt-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
