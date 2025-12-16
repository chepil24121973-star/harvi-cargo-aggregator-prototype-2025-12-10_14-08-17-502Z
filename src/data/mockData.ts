import { Application, LogisticsCompany, TNVEDSuggestion, CertificationRequirements } from '../types';
import { searchTNVEDByText, findTNVEDByCode, normalizeTNVEDCode } from '../utils/tnvedService';

export const mockApplications: Application[] = [
  {
    id: '1',
    userId: '1',
    createdAt: '2024-01-15',
    status: 'completed',
    products: [
      {
        id: '1-1',
        productName: 'Детские игрушки',
        productMaterial: 'Пластик ABS',
        productDescription: 'Развивающие игрушки для детей 3-7 лет',
        tnvedCode: '9503006100',
        quantity: 500,
      },
      {
        id: '1-2',
        productName: 'Мягкие игрушки',
        productMaterial: 'Плюш, синтепон',
        productDescription: 'Плюшевые мишки и зайцы',
        tnvedCode: '9503004100',
        quantity: 300,
      },
    ],
    weight: 250,
    volume: 2.5,
    productCost: 3000,
    incoterms: 'EXW',
    originCity: 'Гуанчжоу',
    destinationCity: 'Москва',
    needMarketplaceDelivery: true,
    marketplace: 'ozon',
    contactName: 'Иван Петров',
    contactPhone: '+7 999 123-45-67',
    contactEmail: 'ivan@example.com',
    selectedOfferId: '1',
  },
  {
    id: '2',
    userId: '1',
    createdAt: '2024-02-20',
    status: 'in_progress',
    products: [
      {
        id: '2-1',
        productName: 'Текстиль для дома',
        productMaterial: 'Хлопок',
        productDescription: 'Постельное белье, полотенца',
        tnvedCode: '6302310000',
        quantity: 200,
      },
    ],
    weight: 180,
    volume: 1.8,
    productCost: 2500,
    incoterms: 'FOB',
    originCity: 'Шанхай',
    destinationCity: 'Санкт-Петербург',
    needMarketplaceDelivery: true,
    marketplace: 'wildberries',
    contactName: 'Иван Петров',
    contactPhone: '+7 999 123-45-67',
    contactEmail: 'ivan@example.com',
  },
];

export const mockLogisticsCompanies: LogisticsCompany[] = [
  {
    id: '1',
    name: 'РусЛогистик Экспресс',
    baseRate: 50,
    conditions: 'Доставка до склада, таможенное оформление включено',
    contactPerson: 'Алексей Смирнов',
    contactPhone: '+7 495 123-45-67',
    contactEmail: 'info@ruslogistic.ru',
  },
  {
    id: '2',
    name: 'Азия Карго Групп',
    baseRate: 45,
    conditions: 'Доставка до терминала в Москве',
    contactPerson: 'Мария Иванова',
    contactPhone: '+7 495 987-65-43',
    contactEmail: 'cargo@asiagroupp.ru',
  },
  {
    id: '3',
    name: 'ВостокТранс',
    baseRate: 55,
    conditions: 'Полный комплекс услуг, доставка до двери',
    contactPerson: 'Дмитрий Козлов',
    contactPhone: '+7 812 555-33-22',
    contactEmail: 'info@vostoktrans.ru',
  },
];

export const getTNVEDSuggestions = async (
  productName: string,
  material: string,
  description: string
): Promise<TNVEDSuggestion[]> => {
  const searchQuery = `${productName} ${material} ${description}`.trim();
  
  if (!searchQuery) {
    return [];
  }

  try {
    const results = await searchTNVEDByText(searchQuery, 10);
    
    return results.map(item => ({
      code: normalizeTNVEDCode(item.code),
      description: item.description,
      confidence: 'high' as const,
    }));
  } catch (error) {
    console.error('Ошибка при поиске ТНВЭД:', error);
    // Fallback на старые данные при ошибке
    return [
      {
        code: '9999999999',
        description: 'Прочие товары народного потребления',
        confidence: 'low',
      },
    ];
  }
};

export const getCertificationRequirements = (tnvedCode: string): CertificationRequirements => {
  const prefix = tnvedCode.substring(0, 4);
  
  if (prefix === '9503') {
    return {
      tnvedCode,
      requirements: [
        'Декларация соответствия ТР ТС 008/2011 "О безопасности игрушек"',
        'Маркировка на русском языке',
        'Инструкция по применению на русском языке',
        'Информация о возрастных ограничениях',
        'Сертификат соответствия (для некоторых категорий)',
      ],
      additionalInfo: 'Игрушки подлежат обязательной сертификации. Срок оформления - от 7 до 14 дней.',
    };
  }
  
  if (prefix === '6302' || prefix === '6109' || prefix === '6110') {
    return {
      tnvedCode,
      requirements: [
        'Декларация соответствия ТР ТС 017/2011 "О безопасности продукции легкой промышленности"',
        'Маркировка на русском языке (состав, уход, производитель)',
        'Информация о размерах по ГОСТ',
        'Наличие этикеток и ярлыков',
      ],
      additionalInfo: 'Текстильные изделия декларируются. Возможно ускоренное оформление за 3-5 дней.',
    };
  }
  
  if (prefix === '8518' || prefix === '8517') {
    return {
      tnvedCode,
      requirements: [
        'Декларация соответствия ТР ТС 020/2011 "Электромагнитная совместимость технических средств"',
        'Сертификат соответствия ТР ТС 020/2011',
        'Инструкция на русском языке',
        'Маркировка CE (при наличии)',
        'Информация о гарантийном обслуживании',
      ],
      additionalInfo: 'Электронные товары требуют обязательной сертификации. Срок - от 10 до 21 дня.',
    };
  }
  
  return {
    tnvedCode,
    requirements: [
      'Декларация соответствия ТР ТС (в зависимости от категории товара)',
      'Маркировка на русском языке',
      'Документы от производителя',
    ],
    additionalInfo: 'Для точного определения требований необходима консультация с таможенным брокером.',
  };
};

export const calculateCostEstimation = (
  weight: number,
  volume: number,
  productCost: number,
  originCity: string,
  destinationCity: string
): any => {
  const baseRatePerKg = 4.5;
  const baseRatePerCbm = 180;
  
  const deliveryCostByWeight = weight * baseRatePerKg;
  const deliveryCostByVolume = volume * baseRatePerCbm;
  const deliveryCostBase = Math.max(deliveryCostByWeight, deliveryCostByVolume);
  
  const deliveryCostMin = Math.round(deliveryCostBase * 0.9);
  const deliveryCostMax = Math.round(deliveryCostBase * 1.2);
  
  const dutyRate = 0.10;
  const vatRate = 0.20;
  
  const customsDuty = Math.round(productCost * dutyRate);
  const customsBase = productCost + customsDuty + deliveryCostBase;
  const vat = Math.round(customsBase * vatRate);
  
  const totalMin = deliveryCostMin + customsDuty + vat;
  const totalMax = deliveryCostMax + customsDuty + vat;
  
  return {
    deliveryCostMin,
    deliveryCostMax,
    customsDuty,
    vat,
    totalMin,
    totalMax,
    notes: `Расчёт основан на маршруте ${originCity} → ${destinationCity}. Фактическая стоимость может отличаться в зависимости от условий поставки.`,
  };
};

export const generateLogisticsOffers = (
  applicationId: string,
  weight: number,
  volume: number,
  productCost: number,
  needMarketplaceDelivery: boolean
) => {
  const baseEstimation = calculateCostEstimation(weight, volume, productCost, 'Китай', 'Россия');
  
  return mockLogisticsCompanies.map((company, index) => {
    const multiplier = 1 + (index * 0.1);
    const cost = Math.round(baseEstimation.totalMin * multiplier);
    const deliveryDays = 14 + (index * 2);
    
    let conditions = company.conditions;
    if (needMarketplaceDelivery) {
      conditions += ', доставка до склада маркетплейса';
    }
    
    return {
      id: `${applicationId}-offer-${company.id}`,
      companyId: company.id,
      companyName: company.name,
      deliveryTime: `${deliveryDays}-${deliveryDays + 4} дней`,
      cost,
      conditions,
    };
  });
};
