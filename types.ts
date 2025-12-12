export interface CashFlowItem {
  name: string;
  value: number;
  description?: string;
  category: 'inflow' | 'outflow' | 'net';
  subItems?: CashFlowItem[]; // For drill-down breakdowns
  explanation?: string;      // For clarifying logic (e.g. Purchase of Goods)
}

export interface SankeyNode {
  name: string;
  category?: 'source' | 'process' | 'destination';
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface FinancialMetrics {
  revenue: number;
  operatingCashInflow: number;
  operatingCashOutflow: number;
  netOperatingCashFlow: number;
  salesCashRatio: number; // Sales Cash / Revenue
  cashFlowMargin: number; // Net OCF / Revenue
}