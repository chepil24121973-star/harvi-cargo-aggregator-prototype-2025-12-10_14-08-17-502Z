import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { QuickProduct, QuickCalcFormData } from '../../types/quickCalculator';

interface QuickCalculatorProps {
  isAuthenticated: boolean;
}

export const QuickCalculator: React.FC<QuickCalculatorProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<QuickProduct[]>([
    {
      id: '1',
      productDescription: '',
      tnvedCode: '',
      weight: '',
      volume: '',
    },
  ]);
  
  const [formData, setFormData] = useState<QuickCalcFormData>({
    productCost: '',
    originCity: 'Гуанчжоу',
    destinationCity: 'Москва',
  });
  
  const [showBlurred, setShowBlurred] = useState(false);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        id: Date.now().toString(),
        productDescription: '',
        tnvedCode: '',
        weight: '',
        volume: '',
      },
    ]);
  };

  const handleRemoveProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleProductChange = (id: string, field: keyof QuickProduct, value: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      const totalWeight = products.reduce((sum, p) => sum + (parseFloat(p.weight) || 0), 0);
      const totalVolume = products.reduce((sum, p) => sum + (parseFloat(p.volume) || 0), 0);
      
      navigate('/application/new', { 
        state: { 
          fromQuickCalc: {
            ...formData,
            productDescription: products[0].productDescription,
            weight: totalWeight.toString(),
            volume: totalVolume.toString(),
            products: products,
          }
        } 
      });
    } else {
      setShowBlurred(true);
    }
  };

  return (
    <section className="container mx-auto px-4 pt-4 pb-12">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Быстрый расчёт стоимости</h2>
        </div>
        
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Товар {index + 1}</h3>
                  {products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Краткое описание товара
                    </label>
                    <input
                      type="text"
                      value={product.productDescription}
                      onChange={(e) => handleProductChange(product.id, 'productDescription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Например: детские игрушки, текстиль, электроника"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Код ТНВЭД
                    </label>
                    <input
                      type="text"
                      value={product.tnvedCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleProductChange(product.id, 'tnvedCode', value);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0000000000"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Вес (кг)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={product.weight}
                        onChange={(e) => handleProductChange(product.id, 'weight', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="250"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Объём (м³)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={product.volume}
                        onChange={(e) => handleProductChange(product.id, 'volume', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="2.5"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Стоимость товара (USD)
            </label>
            <input
              type="number"
              value={formData.productCost}
              onChange={(e) => setFormData({ ...formData, productCost: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Город отправления
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
                Город назначения
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

          <button
            type="button"
            onClick={handleAddProduct}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            <Plus className="w-4 h-4" />
            Добавить другой товар
          </button>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Рассчитать
          </button>
        </form>

        {showBlurred && (
          <div className="mt-6 relative">
            <div className="blur-sm bg-gray-100 p-6 rounded-lg">
              <div className="space-y-3">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-6 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md">
                <p className="text-lg text-gray-900 mb-4">
                  Авторизуйтесь, чтобы увидеть детали расчёта и отправить запрос логистическим компаниям
                </p>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Войти / Зарегистрироваться
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <p className="text-center text-xl text-gray-600 mt-8 max-w-2xl mx-auto">
        Агрегатор логистических услуг для селлеров маркетплейсов OZON, Wildberries и других
      </p>
    </section>
  );
};
