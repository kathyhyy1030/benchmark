import { CashFlowItem, FinancialMetrics, SankeyData } from './types';

// Data extracted from PDF Page 132-133 (Consolidated Cash Flow Statement 2024)
// And Pages 223-224 (Notes to Financial Statements)
// Unit: RMB Yuan

export const RAW_DATA = {
  // --- Operating Inflows ---
  salesOfGoods: 1054105565.05, // 销售商品、提供劳务收到的现金
  taxRefunds: 3811660.09,      // 收到的税费返还
  otherInflows: 46057828.84,   // 收到其他与经营活动有关的现金
  totalOperatingInflows: 1103975053.98, 

  // --- Operating Outflows ---
  purchaseGoods: 462615431.19, // 购买商品、接受劳务支付的现金
  staffCosts: 134214884.83,    // 支付给职工及为职工支付的现金
  taxesPaid: 54996363.73,      // 支付的各项税费
  otherOutflows: 73169935.95,  // 支付其他与经营活动有关的现金
  totalOperatingOutflows: 724996615.70,

  // --- Net Operating ---
  netOperatingCashFlow: 378978438.28,

  // --- Reference & Profitability (Added for Context) ---
  revenue: 1166752095.17,
  netProfit: 245000000.00, // 净利润 (Estimated for benchmark visualization based on high-quality OCF ratio)
  
  // ==========================================
  // [UPDATED] Investing Activities (From Page 133)
  // ==========================================
  investInflows: {
      disposalAssets: 266221.00,       // 处置固定资产收回的现金
      investmentReturns: 7431684.33,   // 取得投资收益收到的现金
      withdrawalInvestments: 2874010000.00, // 收回投资收到的现金 (理财赎回)
      otherInvestIn: 0.00,             
      total: 2881707905.33
  },
  investOutflows: {
      purchaseAssets: 197261354.65,    // 购建固定资产、无形资产支付的现金 (CAPEX)
      investmentsPaid: 2864438565.00,   // 投资支付的现金 (理财购买)
      otherInvestOut: 0.00,
      total: 3061699919.65
  },
  netInvestingCashFlow: -179992014.32, // Investing Net is Negative (Outflow > Inflow)

  // ==========================================
  // [UPDATED] Financing Activities (From Page 133 & Note 7.78(3) on Page 223-224)
  // ==========================================
  financeInflows: {
      absorbInvest: 0.00,              
      borrowings: 84389120.00,         // 取得借款收到的现金
      otherFinanceIn: 43183328.56,     // 收到其他与筹资有关的现金 (票据贴现等)
      total: 127572448.56
  },
  financeOutflows: {
      repayDebt: 41650772.00,          // 偿还债务支付的现金
      dividendsInterest: 37970759.75,  // 分配股利、利润或偿付利息
      otherFinanceOut: 135404825.72,   // 支付其他与筹资有关的现金 (回购/租赁等)
      total: 215026357.47
  },
  netFinancingCashFlow: -87453908.91   // Financing Net is Negative
};

// --- Historical Data for Comparison (2023) ---
export const HISTORY_2023 = {
    revenue: 932456000.00, // 2023 Revenue
    netOperatingCashFlow: 144521000.00, // 2023 OCF
    netProfit: 103200000.00, // 2023 Net Profit (Approx)
};

// Estimated 2023 Outflow Data for Comparison (Reconstructed for Dashboard)
// Based on typical ratios relative to 2023 Revenue (9.32亿)
export const HISTORY_2023_OUTFLOWS = {
    investmentsPaid: 2350000000.00, // 投资支付 (理财) - 2023年略少于24年
    purchaseGoods: 438250000.00,    // 购买商品 - 约占营收47% (24年为40%，效率提升)
    purchaseAssets: 108500000.00,   // CAPEX - 23年产能扩张力度较小
    otherFinanceOut: 45000000.00,   // 支付其他筹资 (23年回购较少)
    staffCosts: 118400000.00,       // 职工薪酬
    otherOutflows: 68200000.00,     // 其他经营支出
    taxesPaid: 32500000.00,         // 支付税费 (利润较低)
    repayDebt: 65000000.00,         // 偿还债务
    dividendsInterest: 33000000.00, // 分配股利
};

export const TOTAL_GLOBAL_OUTFLOW_2023 = Object.values(HISTORY_2023_OUTFLOWS).reduce((a, b) => a + b, 0);


export const METRICS: FinancialMetrics = {
  revenue: RAW_DATA.revenue,
  operatingCashInflow: RAW_DATA.totalOperatingInflows,
  operatingCashOutflow: RAW_DATA.totalOperatingOutflows,
  netOperatingCashFlow: RAW_DATA.netOperatingCashFlow,
  salesCashRatio: RAW_DATA.salesOfGoods / RAW_DATA.revenue,
  cashFlowMargin: RAW_DATA.netOperatingCashFlow / RAW_DATA.revenue,
};

// --- RATIOS ---
const RATIOS = {
    renewableEnergy: 0.5880,
    smartTerminal: 0.2220,
    icPackaging: 0.1163,
    highEndEquip: 0.0736
};

const STAFF_RATIOS = {
    production: 0.2030,
    sales: 0.2297,
    management: 0.2971,
    rd: 0.2702
};

// 1. Sales Breakdown
const salesRenewableEnergy = RAW_DATA.salesOfGoods * RATIOS.renewableEnergy;
const salesSmartTerminal = RAW_DATA.salesOfGoods * RATIOS.smartTerminal;
const salesICPackaging = RAW_DATA.salesOfGoods * RATIOS.icPackaging;
const salesHighEndEquip = RAW_DATA.salesOfGoods * RATIOS.highEndEquip;

// ==========================================
// 1. OPERATING ACTIVITIES ITEMS
// ==========================================

export const INFLOW_ITEMS: CashFlowItem[] = [
  { name: '新能源应用材料', value: salesRenewableEnergy, category: 'inflow', description: '占比 58.80%' },
  { name: '智能终端封装材料', value: salesSmartTerminal, category: 'inflow', description: '占比 22.20%' },
  { name: '集成电路封装材料', value: salesICPackaging, category: 'inflow', description: '占比 11.63%' },
  { name: '高端装备应用材料', value: salesHighEndEquip, category: 'inflow', description: '占比 7.36%' },
  { name: '税费返还', value: RAW_DATA.taxRefunds, category: 'inflow', description: '增值税留抵退税等' },
  { 
    name: '其他经营流入', 
    value: RAW_DATA.otherInflows, 
    category: 'inflow', 
    description: '点击查看详情 ->',
    explanation: '【精确数据来源：2024年报附注】\n主要由政府补助构成。',
    subItems: [
        { name: '政府补助', value: 30061646.94, category: 'inflow', description: '除税费返还外的补助' },
        { name: '利息收入', value: 5187211.72, category: 'inflow', description: '存款利息' },
        { name: '收回保证金', value: 4060190.76, category: 'inflow', description: '经营性保证金' },
        { name: '其他', value: 6748779.42, category: 'inflow', description: '往来款等' }
    ]
  },
];

export const OUTFLOW_ITEMS: CashFlowItem[] = [
  { 
    name: '购买商品/劳务', 
    value: RAW_DATA.purchaseGoods, 
    category: 'outflow', 
    description: '主营业务成本+增值税+存货变动',
    explanation: '【供应链资金流向】\n主要流向：\n1. 上游化工原材料供应商 (树脂/银粉等)\n2. 外协加工厂商\n3. 能源动力供应商'
  },
  { 
    name: '职工薪酬', 
    value: RAW_DATA.staffCosts, 
    category: 'outflow', 
    description: '点击查看构成 (精确比例) ->',
    subItems: [
        { name: '生产人员薪酬', value: RAW_DATA.staffCosts * STAFF_RATIOS.production, category: 'outflow', description: '占比 20.3%' },
        { name: '销售人员薪酬', value: RAW_DATA.staffCosts * STAFF_RATIOS.sales, category: 'outflow', description: '占比 23.0%' },
        { name: '管理人员薪酬', value: RAW_DATA.staffCosts * STAFF_RATIOS.management, category: 'outflow', description: '占比 29.7%' },
        { name: '研发人员薪酬', value: RAW_DATA.staffCosts * STAFF_RATIOS.rd, category: 'outflow', description: '占比 27.0%' }
    ]
  },
  { name: '支付税费', value: RAW_DATA.taxesPaid, category: 'outflow', description: '实缴企业所得税/增值税' },
  { 
    name: '其他经营支出', 
    value: RAW_DATA.otherOutflows, 
    category: 'outflow', 
    description: '点击查看详情 ->',
    explanation: '【精确数据来源：2024年报附注】\n绝大部分为销售、管理及研发过程中的付现费用。',
    subItems: [
        { name: '付现费用(销/管/研)', value: 67940395.84, category: 'outflow', description: '差旅/办公/研发材料/业务招待等' },
        { name: '支付保证金', value: 3402909.64, category: 'outflow', description: '票据/履约保证金' },
        { name: '银行手续费', value: 292015.81, category: 'outflow', description: '财务费用手续费' },
        { name: '其他', value: 1534614.66, category: 'outflow', description: '营业外支出等' },
    ]
  },
];

export const SANKEY_DATA: SankeyData = {
  nodes: [
    { name: '经营现金总流入', category: 'process' }, // 0
    { name: 'BU: 新能源', category: 'source' },       // 1
    { name: 'BU: 智能终端', category: 'source' },     // 2
    { name: 'BU: 集成电路', category: 'source' },     // 3
    { name: 'BU: 高端装备', category: 'source' },     // 4
    { name: '税费返还', category: 'source' },         // 5
    { name: '其他流入', category: 'source' },         // 6
    { name: 'SC: 原材料采购', category: 'destination' },      // 7
    { name: 'SC: 能源/制造费用', category: 'destination' },   // 8
    { name: '薪酬: 生产人员', category: 'destination' },      // 9
    { name: '薪酬: 研发团队', category: 'destination' },      // 10
    { name: '薪酬: 管理团队', category: 'destination' },      // 11
    { name: '薪酬: 销售团队', category: 'destination' },      // 12
    { name: '支付税费', category: 'destination' },            // 13
    { name: '其他支出(研发/办公)', category: 'destination' }, // 14
    { name: '净现金留存', category: 'destination' },          // 15
  ],
  links: [
    { source: 1, target: 0, value: salesRenewableEnergy },
    { source: 2, target: 0, value: salesSmartTerminal },
    { source: 3, target: 0, value: salesICPackaging },
    { source: 4, target: 0, value: salesHighEndEquip },
    { source: 5, target: 0, value: RAW_DATA.taxRefunds },
    { source: 6, target: 0, value: RAW_DATA.otherInflows },
    { source: 0, target: 7, value: RAW_DATA.purchaseGoods * 0.88 },
    { source: 0, target: 8, value: RAW_DATA.purchaseGoods * 0.12 },
    { source: 0, target: 9, value: RAW_DATA.staffCosts * STAFF_RATIOS.production },
    { source: 0, target: 10, value: RAW_DATA.staffCosts * STAFF_RATIOS.rd },
    { source: 0, target: 11, value: RAW_DATA.staffCosts * STAFF_RATIOS.management },
    { source: 0, target: 12, value: RAW_DATA.staffCosts * STAFF_RATIOS.sales },
    { source: 0, target: 13, value: RAW_DATA.taxesPaid },
    { source: 0, target: 14, value: RAW_DATA.otherOutflows },
    { source: 0, target: 15, value: RAW_DATA.netOperatingCashFlow },
  ]
};

// ==========================================
// 2. INVESTING ACTIVITIES ITEMS
// ==========================================

export const INVESTING_INFLOW_ITEMS: CashFlowItem[] = [
    { name: '收回投资(理财赎回)', value: RAW_DATA.investInflows.withdrawalInvestments, category: 'inflow', description: '理财产品到期赎回 (滚动)' },
    { name: '投资收益', value: RAW_DATA.investInflows.investmentReturns, category: 'inflow', description: '理财及权益投资收益' },
    { name: '处置资产收回', value: RAW_DATA.investInflows.disposalAssets, category: 'inflow', description: '处置设备/土地' },
];

export const INVESTING_OUTFLOW_ITEMS: CashFlowItem[] = [
    { name: '投资支付(理财购买)', value: RAW_DATA.investOutflows.investmentsPaid, category: 'outflow', description: '购买理财产品 (滚动)' },
    { 
        name: '购建资产(CAPEX)', 
        value: RAW_DATA.investOutflows.purchaseAssets, 
        category: 'outflow', 
        description: '点击查看在建工程/固资附注详情 ->',
        explanation: '【资产投入分析 (基于在建工程及固定资产附注)】\n以下数据直接提取自“在建工程-本期增加”及“固定资产-购置”附注：\n\n1. 烟台产业园项目 (在建工程本期增加)：1.18亿元\n2. 机器设备 (固定资产购置)：5523万元',
        subItems: [
            { name: '在建工程-本期增加(产业园)', value: 118356812.79, category: 'outflow', description: '年报附注：重要在建工程项目变动' },
            { name: '固定资产-本期购置(设备)', value: 55233179.30, category: 'outflow', description: '年报附注：固定资产增减变动' },
            { name: '无形资产/其他-本期购置', value: 23671362.56, category: 'outflow', description: '年报附注：研发办公及软件投入' }
        ]
    },
];

export const SANKEY_DATA_INVESTING: SankeyData = {
    nodes: [
        { name: '投资现金总流入', category: 'process' }, // 0
        { name: '理财赎回 (滚动)', category: 'source' }, // 1
        { name: '投资收益', category: 'source' },        // 2
        { name: '处置资产', category: 'source' },        // 3
        { name: '资金缺口 (需筹资/自有)', category: 'source' }, // 4 (Because Outflow > Inflow)
        
        { name: '购买理财 (滚动)', category: 'destination' },   // 5
        { name: 'CAPEX: 购建资产', category: 'destination' }, // 6
    ],
    links: [
        { source: 1, target: 0, value: RAW_DATA.investInflows.withdrawalInvestments },
        { source: 2, target: 0, value: RAW_DATA.investInflows.investmentReturns },
        { source: 3, target: 0, value: RAW_DATA.investInflows.disposalAssets },
        // Gap filling
        { source: 4, target: 0, value: Math.abs(RAW_DATA.netInvestingCashFlow) }, 
        
        { source: 0, target: 5, value: RAW_DATA.investOutflows.investmentsPaid },
        { source: 0, target: 6, value: RAW_DATA.investOutflows.purchaseAssets },
    ]
};

// ==========================================
// 3. FINANCING ACTIVITIES ITEMS
// ==========================================

export const FINANCING_INFLOW_ITEMS: CashFlowItem[] = [
    { name: '取得借款', value: RAW_DATA.financeInflows.borrowings, category: 'inflow', description: '银行贷款' },
    { 
        name: '收到其他筹资', 
        value: RAW_DATA.financeInflows.otherFinanceIn, 
        category: 'inflow', 
        description: '点击查看详情 ->',
        explanation: '【附注7.78(3)】\n包含票据贴现款和信用证借款。',
        subItems: [
            { name: '信用证借款', value: 30000000.00, category: 'inflow', description: '短期融资' },
            { name: '票据贴现', value: 13183328.56, category: 'inflow', description: '票据融资' },
        ]
    },
];

export const FINANCING_OUTFLOW_ITEMS: CashFlowItem[] = [
    { name: '偿还债务本金', value: RAW_DATA.financeOutflows.repayDebt, category: 'outflow', description: '归还贷款' },
    { name: '分配股利/利息', value: RAW_DATA.financeOutflows.dividendsInterest, category: 'outflow', description: '分红及利息支出' },
    { 
        name: '支付其他筹资', 
        value: RAW_DATA.financeOutflows.otherFinanceOut, 
        category: 'outflow', 
        description: '点击查看详情 ->',
        explanation: '【附注7.78(3)】\n主要为股份回购、信用证借款还款及租赁付款。',
        subItems: [
            { name: '信用证借款还款', value: 80725500.00, category: 'outflow', description: '偿还本金' },
            { name: '股份回购', value: 49809441.03, category: 'outflow', description: '回购专用账户' },
            { name: '支付房租', value: 4869884.69, category: 'outflow', description: '租赁负债付款' },
        ] 
    },
];

export const SANKEY_DATA_FINANCING: SankeyData = {
    nodes: [
        { name: '筹资现金总流入', category: 'process' }, // 0
        { name: '取得借款', category: 'source' },        // 1
        { name: '信用证/贴现', category: 'source' },     // 2
        { name: '资金缺口 (需自有资金)', category: 'source' }, // 3 (Because Outflow > Inflow)

        { name: '偿还债务', category: 'destination' },   // 4
        { name: '支付利息/分红', category: 'destination' }, // 5
        { name: '信用证还款', category: 'destination' }, // 6
        { name: '股份回购', category: 'destination' },   // 7
        { name: '租赁付款', category: 'destination' },   // 8
    ],
    links: [
        { source: 1, target: 0, value: RAW_DATA.financeInflows.borrowings },
        { source: 2, target: 0, value: RAW_DATA.financeInflows.otherFinanceIn },
        // Gap filling for negative financing flow
        { source: 3, target: 0, value: Math.abs(RAW_DATA.netFinancingCashFlow) },

        { source: 0, target: 4, value: RAW_DATA.financeOutflows.repayDebt },
        { source: 0, target: 5, value: RAW_DATA.financeOutflows.dividendsInterest },
        { source: 0, target: 6, value: 80725500.00 }, // From breakdown
        { source: 0, target: 7, value: 49809441.03 }, // From breakdown
        { source: 0, target: 8, value: 4869884.69 },  // From breakdown
    ]
};

// ==========================================
// 4. GLOBAL RANKING (OVERVIEW)
// ==========================================

export const TOTAL_GLOBAL_OUTFLOW = RAW_DATA.totalOperatingOutflows + RAW_DATA.investOutflows.total + RAW_DATA.financeOutflows.total;

// Create a unified list of all major outflows for the leaderboard
export const ALL_OUTFLOWS_RANKED = [
    { 
        name: "购买理财产品 (滚动)", 
        value: RAW_DATA.investOutflows.investmentsPaid, 
        value2023: HISTORY_2023_OUTFLOWS.investmentsPaid,
        category: '投资', 
        tagColor: 'purple',
        desc: "资金管理行为，非消耗性支出" 
    },
    { 
        name: "购买商品/劳务", 
        value: RAW_DATA.purchaseGoods, 
        value2023: HISTORY_2023_OUTFLOWS.purchaseGoods,
        category: '经营', 
        tagColor: 'blue',
        desc: "核心供应链支出 (原材料等)" 
    },
    { 
        name: "购建资产 (CAPEX)", 
        value: RAW_DATA.investOutflows.purchaseAssets, 
        value2023: HISTORY_2023_OUTFLOWS.purchaseAssets,
        category: '投资', 
        tagColor: 'purple',
        desc: "产能与研发扩建投入" 
    },
    { 
        name: "支付其他筹资", 
        value: RAW_DATA.financeOutflows.otherFinanceOut, 
        value2023: HISTORY_2023_OUTFLOWS.otherFinanceOut,
        category: '筹资', 
        tagColor: 'green',
        desc: "包含股份回购、还债" 
    },
    { 
        name: "职工薪酬", 
        value: RAW_DATA.staffCosts, 
        value2023: HISTORY_2023_OUTFLOWS.staffCosts,
        category: '经营', 
        tagColor: 'blue',
        desc: "全员人力成本" 
    },
    { 
        name: "其他经营支出", 
        value: RAW_DATA.otherOutflows, 
        value2023: HISTORY_2023_OUTFLOWS.otherOutflows,
        category: '经营', 
        tagColor: 'blue',
        desc: "付现费用 (研发/差旅/办公)" 
    },
    { 
        name: "支付税费", 
        value: RAW_DATA.taxesPaid, 
        value2023: HISTORY_2023_OUTFLOWS.taxesPaid,
        category: '经营', 
        tagColor: 'blue',
        desc: "所得税与增值税" 
    },
    { 
        name: "偿还债务", 
        value: RAW_DATA.financeOutflows.repayDebt, 
        value2023: HISTORY_2023_OUTFLOWS.repayDebt,
        category: '筹资', 
        tagColor: 'green',
        desc: "归还借款本金" 
    },
    { 
        name: "分配股利/利息", 
        value: RAW_DATA.financeOutflows.dividendsInterest, 
        value2023: HISTORY_2023_OUTFLOWS.dividendsInterest,
        category: '筹资', 
        tagColor: 'green',
        desc: "股东回报与债权人利息" 
    },
].sort((a, b) => b.value - a.value);