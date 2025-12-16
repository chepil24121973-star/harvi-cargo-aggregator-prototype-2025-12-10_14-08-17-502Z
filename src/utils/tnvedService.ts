export interface TNVEDCode {
  code: string;
  description: string;
  category: string;
  dutyRate: number;
  keywords: string[];
  unit: string;
}

let tnvedData: TNVEDCode[] | null = null;
let tnvedDataPromise: Promise<TNVEDCode[]> | null = null;

// Нормализация кода ТНВЭД (убираем пробелы)
export const normalizeTNVEDCode = (code: string): string => {
  return code.replace(/\s+/g, '');
};

// Денормализация кода ТНВЭД (добавляем пробелы для отображения)
export const formatTNVEDCode = (code: string): string => {
  const cleaned = code.replace(/\s+/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9, 10)}`;
  }
  return cleaned;
};

// Ленивая загрузка данных ТНВЭД
export const loadTNVEDData = async (): Promise<TNVEDCode[]> => {
  if (tnvedData) {
    return tnvedData;
  }

  if (tnvedDataPromise) {
    return tnvedDataPromise;
  }

  tnvedDataPromise = fetch('/docs/tnvedCodes.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Не удалось загрузить базу ТНВЭД');
      }
      return response.json();
    })
    .then((data: TNVEDCode[]) => {
      tnvedData = data;
      return tnvedData;
    })
    .catch(error => {
      console.error('Ошибка загрузки базы ТНВЭД:', error);
      // Возвращаем пустой массив при ошибке
      tnvedData = [];
      return tnvedData;
    });

  return tnvedDataPromise;
};

// Поиск по коду ТНВЭД
export const findTNVEDByCode = async (code: string): Promise<TNVEDCode | null> => {
  const data = await loadTNVEDData();
  const normalizedCode = normalizeTNVEDCode(code);
  
  return data.find(item => normalizeTNVEDCode(item.code) === normalizedCode) || null;
};

// Поиск по части кода (автодополнение)
export const searchTNVEDByCodePrefix = async (prefix: string, limit: number = 10): Promise<TNVEDCode[]> => {
  const data = await loadTNVEDData();
  const normalizedPrefix = normalizeTNVEDCode(prefix);
  
  if (!normalizedPrefix) {
    return [];
  }

  const matches = data
    .filter(item => {
      const normalizedItemCode = normalizeTNVEDCode(item.code);
      return normalizedItemCode.startsWith(normalizedPrefix);
    })
    .slice(0, limit);

  return matches;
};

// Поиск по описанию и ключевым словам
export const searchTNVEDByText = async (query: string, limit: number = 10): Promise<TNVEDCode[]> => {
  const data = await loadTNVEDData();
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return [];
  }

  const matches = data
    .filter(item => {
      const descriptionMatch = item.description.toLowerCase().includes(lowerQuery);
      const keywordsMatch = item.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery));
      return descriptionMatch || keywordsMatch;
    })
    .slice(0, limit);

  return matches;
};

// Комбинированный поиск (по коду и тексту)
export const searchTNVED = async (query: string, limit: number = 10): Promise<TNVEDCode[]> => {
  const normalizedQuery = normalizeTNVEDCode(query);
  
  // Если запрос похож на код (только цифры), ищем по коду
  if (/^\d+$/.test(normalizedQuery) && normalizedQuery.length >= 2) {
    return searchTNVEDByCodePrefix(normalizedQuery, limit);
  }
  
  // Иначе ищем по тексту
  return searchTNVEDByText(query, limit);
};

