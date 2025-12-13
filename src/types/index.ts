export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  telegram?: string;
}

export interface LogisticsCompany {
  id: string;
  name: string;
  baseRate: number;
  conditions: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
}

export interface Product {
  id: string;
  productName: string;
  productMaterial: string;
  productDescription: string;
  tnvedCode: string;
  quantity: number;
}

export interface Application {
  id: string;
  userId: string;
  createdAt: string;
  status: 'draft' | 'sent' | 'in_progress' | 'completed';
  
  products: Product[];
  
  weight: number;
  volume: number;
  productCost: number;
  incoterms: string;
  
  originCity: string;
  destinationCity: string;
  needMarketplaceDelivery: boolean;
  marketplace?: 'ozon' | 'wildberries' | 'other';
  
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactTelegram?: string;
  
  selectedOfferId?: string;
}

export interface LogisticsOffer {
  id: string;
  companyId: string;
  companyName: string;
  deliveryTime: string;
  cost: number;
  conditions: string;
}

export interface TNVEDSuggestion {
  code: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface CertificationRequirements {
  tnvedCode: string;
  requirements: string[];
  additionalInfo: string;
}

export interface CostEstimation {
  deliveryCostMin: number;
  deliveryCostMax: number;
  customsDuty: number;
  vat: number;
  totalMin: number;
  totalMax: number;
  notes: string;
}
