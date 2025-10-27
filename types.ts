export interface CostItem {
  item: string;
  cost: number;
}

export interface Quote {
  partName: string;
  material: string;
  manufacturingProcess: string;
  finish: string;
  costBreakdown: CostItem[];
  totalCost: number;
  leadTime: string;
  assumptions: string[];
}

export interface QuoteOptions {
  quantity: number;
  material: string;
  finish: string;
  leadTime: string;
}
