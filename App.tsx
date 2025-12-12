import React, { useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Banknote, Building2, Wallet, Info, FileText, Calculator, TrendingUp, Layers, DollarSign, BookOpen, BarChart3, PieChart as PieChartIcon, LayoutDashboard, Scale, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import MetricCard from './components/MetricCard';
import SankeyDiagram from './components/SankeyDiagram';
import BreakdownChart from './components/BreakdownChart';
import BenchmarkGuide from './components/BenchmarkGuide';
import { 
    METRICS, 
    SANKEY_DATA, INFLOW_ITEMS, OUTFLOW_ITEMS,
    SANKEY_DATA_INVESTING, INVESTING_INFLOW_ITEMS, INVESTING_OUTFLOW_ITEMS, RAW_DATA,
    SANKEY_DATA_FINANCING, FINANCING_INFLOW_ITEMS, FINANCING_OUTFLOW_ITEMS,
    ALL_OUTFLOWS_RANKED, TOTAL_GLOBAL_OUTFLOW, HISTORY_2023, TOTAL_GLOBAL_OUTFLOW_2023
} from './constants';

type TabType = 'overview' | 'operating' | 'investing' | 'financing';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showGuide, setShowGuide] = useState(false);

  const formatCurrency = (val: number) => {
    const absVal = Math.abs(val);
    let str = '';
    if (absVal >= 100000000) {
      str = `${(absVal / 100000000).toFixed(2)} 亿元`;
    } else if (absVal >= 10000000) {
      str = `${(absVal / 10000000).toFixed(2)} 千万元`;
    } else {
      str = `${(absVal / 1000000).toFixed(2)} 百万元`;
    }
    return val < 0 ? `-${str}` : str;
  };

  const formatPercent = (val: number) => `${(val * 100).toFixed(2)}%`;

  // Data for the Scale/Comparison Chart
  const scaleData = [
    { name: '营业收入 (Revenue)', value: RAW_DATA.revenue, color: '#3b82f6', desc: '业务总规模' },
    { name: '净利润 (Net Profit)', value: RAW_DATA.netProfit, color: '#10b981', desc: '最终盈利' },
    { name: '经营净现金 (OCF)', value: RAW_DATA.netOperatingCashFlow, color: '#f59e0b', desc: '实际造血' },
    // { name: '总现金流出', value: TOTAL_GLOBAL_OUTFLOW, color: '#ef4444', desc: '总资金消耗' }, 
  ];

  const renderContent = () => {
      switch(activeTab) {
          case 'overview':
            return (
                <div className="space-y-6">
                    {/* Financial Scale Context (New Section) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                         <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Scale className="text-indigo-600" />
                                    财务规模全景对比 (Financial Scale Context)
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    对比“营收-利润-现金流”三者关系，评估现金流规模是否与业务体量匹配
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                    净现比: {formatPercent(RAW_DATA.netOperatingCashFlow / RAW_DATA.revenue)}
                                </div>
                                <div className="px-3 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                    盈利现金含量: {formatPercent(RAW_DATA.netOperatingCashFlow / RAW_DATA.netProfit)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Bar Chart Comparison */}
                            <div className="lg:col-span-2 h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={scaleData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={140} tick={{fontSize: 12, fontWeight: 500}} />
                                        <Tooltip 
                                            formatter={(value: number) => formatCurrency(value)}
                                            cursor={{fill: '#f3f4f6'}}
                                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                        />
                                        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                                            {scaleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Right: Insights & Ratios */}
                            <div className="bg-gray-50 rounded-lg p-5 flex flex-col justify-center space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">含金量分析 & 23年对比</h4>
                                    
                                    {/* 2023 Comparison Table Mini */}
                                    <div className="mb-4 bg-white p-3 rounded border border-gray-100 shadow-sm">
                                        <div className="grid grid-cols-3 text-xs gap-2 mb-1 text-gray-500 font-medium">
                                            <div>指标</div>
                                            <div className="text-right">2024年</div>
                                            <div className="text-right">2023年</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-xs gap-2 mb-1">
                                            <div className="text-gray-800">营收</div>
                                            <div className="text-right font-mono text-blue-600">11.67亿</div>
                                            <div className="text-right font-mono text-gray-400">9.32亿</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-xs gap-2">
                                            <div className="text-gray-800">经营净现</div>
                                            <div className="text-right font-mono text-amber-600">3.79亿</div>
                                            <div className="text-right font-mono text-gray-400">1.45亿</div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-center">
                                            * 2024年现金流状况显著优于2023年 (OCF +162%)
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        德邦科技每 <strong>100元</strong> 营收：
                                        <br/>• 产生约 <span className="text-green-600 font-bold">21元</span> 净利润
                                        <br/>• 沉淀 <span className="text-amber-600 font-bold">32.5元</span> 经营净现金
                                        <br/><span className="text-xs text-gray-400 mt-1 block">(注：净现比 {'>'} 1，且显著高于23年的15%水平，说明24年回款极佳)</span>
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">CAPEX 覆盖能力</h4>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="text-gray-500">经营净现金</span>
                                        <span className="font-mono">{formatCurrency(RAW_DATA.netOperatingCashFlow)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mb-2">
                                        <span className="text-gray-500">CAPEX支出</span>
                                        <span className="font-mono">{formatCurrency(RAW_DATA.investOutflows.purchaseAssets)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                    <p className="text-xs text-indigo-600 mt-2 font-medium">
                                        经营现金完全覆盖资本支出 (Coverage: {(RAW_DATA.netOperatingCashFlow / RAW_DATA.investOutflows.purchaseAssets).toFixed(1)}x)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Leaderboard Sheet (Existing) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <BarChart3 className="text-blue-600" />
                                    资金流出排行榜 (2024 vs 2023)
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">按2024年金额从大到小排序，对比两年流出结构变化</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs text-gray-500 block">2024 全年总流出</span>
                                <span className="text-lg font-bold text-gray-800">{formatCurrency(TOTAL_GLOBAL_OUTFLOW)}</span>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-4 w-12 text-center">#</th>
                                        <th className="px-4 py-4 min-w-[200px]">项目名称 (Item)</th>
                                        <th className="px-2 py-4 w-20 text-center">分类</th>
                                        
                                        {/* 2024 Column */}
                                        <th className="px-4 py-4 text-right bg-blue-50 bg-opacity-30 border-l border-blue-100">
                                            <div className="flex flex-col">
                                                <span>2024 金额</span>
                                                <span className="text-[10px] font-normal text-gray-400">当前年度</span>
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 w-24 bg-blue-50 bg-opacity-30">占比 (2024)</th>

                                        {/* 2023 Column */}
                                        <th className="px-4 py-4 text-right border-l border-gray-100">
                                            <div className="flex flex-col">
                                                <span>2023 金额</span>
                                                <span className="text-[10px] font-normal text-gray-400">对比年度</span>
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 w-24">占比 (2023)</th>

                                        {/* YoY Change */}
                                        <th className="px-4 py-4 w-24 text-center border-l border-gray-100">同比变动</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {ALL_OUTFLOWS_RANKED.map((item, index) => {
                                        const percentage2024 = (item.value / TOTAL_GLOBAL_OUTFLOW) * 100;
                                        
                                        // 2023 Calculations
                                        const value2023 = item.value2023 || 0;
                                        const percentage2023 = (value2023 / TOTAL_GLOBAL_OUTFLOW_2023) * 100;
                                        
                                        // YoY Change
                                        const diff = item.value - value2023;
                                        const diffPercent = value2023 > 0 ? ((diff / value2023) * 100) : 0;
                                        
                                        // Badge Colors
                                        let badgeClass = "bg-gray-100 text-gray-600";
                                        if (item.tagColor === 'blue') badgeClass = "bg-blue-50 text-blue-700 border border-blue-100";
                                        if (item.tagColor === 'purple') badgeClass = "bg-purple-50 text-purple-700 border border-purple-100";
                                        if (item.tagColor === 'green') badgeClass = "bg-green-50 text-green-700 border border-green-100";

                                        return (
                                            <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-4 py-3 text-center font-bold text-gray-400 group-hover:text-blue-600">
                                                    {index + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-gray-800">{item.name}</div>
                                                    <div className="text-xs text-gray-400 truncate max-w-[180px]">{item.desc}</div>
                                                </td>
                                                <td className="px-2 py-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${badgeClass}`}>
                                                        {item.category}
                                                    </span>
                                                </td>

                                                {/* 2024 Data */}
                                                <td className="px-4 py-3 text-right font-mono text-gray-900 bg-blue-50 bg-opacity-30 border-l border-blue-100 font-medium">
                                                    {formatCurrency(item.value)}
                                                </td>
                                                <td className="px-4 py-3 bg-blue-50 bg-opacity-30">
                                                     <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-gray-600">{percentage2024.toFixed(1)}%</span>
                                                        <div className="w-10 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500" style={{ width: `${percentage2024}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 2023 Data */}
                                                <td className="px-4 py-3 text-right font-mono text-gray-500 border-l border-gray-100">
                                                    {formatCurrency(value2023)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2 opacity-60">
                                                        <span className="text-xs font-medium text-gray-500">{percentage2023.toFixed(1)}%</span>
                                                        <div className="w-10 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gray-400" style={{ width: `${percentage2023}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* YoY Trend */}
                                                <td className="px-4 py-3 text-center border-l border-gray-100">
                                                    <div className={`flex items-center justify-center text-xs font-bold px-2 py-1 rounded-full w-20 mx-auto ${diffPercent > 0 ? 'bg-red-50 text-red-600' : diffPercent < 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                                        {diffPercent > 0 ? <ArrowUp size={10} className="mr-0.5" /> : diffPercent < 0 ? <ArrowDown size={10} className="mr-0.5" /> : <Minus size={10} className="mr-0.5" />}
                                                        {Math.abs(diffPercent).toFixed(1)}%
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-yellow-50 text-yellow-800 text-xs text-center border-t border-yellow-100">
                            注意：2023年数据基于年报历史数据重构。对比显示，<strong>购买商品</strong>占比显著下降（效率提升），而<strong>CAPEX</strong>占比上升（产能扩张加速）。
                        </div>
                    </div>
                </div>
            );

          case 'operating':
              return (
                <>
                    {/* Operating Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <MetricCard 
                            title="经营活动净现金流 (Net OCF)"
                            value={formatCurrency(METRICS.netOperatingCashFlow)}
                            rawValue={METRICS.netOperatingCashFlow}
                            prevValue={HISTORY_2023.netOperatingCashFlow}
                            prevLabel="vs 2023"
                            subValue="造血能力核心指标"
                            color="green"
                            icon={<Wallet className="text-green-600" />}
                        />
                        <MetricCard 
                            title="营业收入 (Revenue)"
                            value={formatCurrency(METRICS.revenue)}
                            rawValue={METRICS.revenue}
                            prevValue={HISTORY_2023.revenue}
                            prevLabel="vs 2023"
                            subValue="同比增长 25.19%"
                            color="blue"
                            icon={<Banknote className="text-blue-600" />}
                        />
                        <MetricCard 
                            title="收现比 (Sales Cash / Revenue)"
                            value={METRICS.salesCashRatio.toFixed(2)}
                            subValue="Benchmark: > 0.9 优秀"
                            color="amber"
                            icon={<ArrowUpRight className="text-amber-600" />}
                        />
                        <MetricCard 
                            title="净现比 (Net OCF / Revenue)"
                            value={formatPercent(METRICS.cashFlowMargin)}
                            subValue="每1元收入产生0.32元净现金"
                            color="blue"
                            icon={<Activity className="text-blue-600" />}
                        />
                    </div>

                    {/* Operating Sankey */}
                    <section className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <ArrowDownRight className="text-purple-600" />
                            经营资金流向 (Operating Flow)
                            </h2>
                        </div>
                        <SankeyDiagram data={SANKEY_DATA} width={1100} height={500} />
                        <p className="mt-3 text-xs text-gray-500 italic text-center max-w-3xl mx-auto">
                            * 数据基于德邦科技2024年报：新能源板块贡献了主要的现金流入，而原材料采购与研发薪酬是主要的流出项。
                        </p>
                    </section>

                    {/* Operating Breakdowns */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <BreakdownChart 
                            title="经营现金流入结构" 
                            data={INFLOW_ITEMS} 
                            total={RAW_DATA.totalOperatingInflows}
                            layout="horizontal"
                        />
                        <BreakdownChart 
                            title="经营现金流出结构" 
                            data={OUTFLOW_ITEMS} 
                            total={RAW_DATA.totalOperatingOutflows}
                            layout="horizontal"
                        />
                    </section>
                </>
              );
          case 'investing':
              return (
                <>
                    {/* Investing Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <MetricCard 
                            title="投资活动净现金流"
                            value={formatCurrency(RAW_DATA.netInvestingCashFlow)}
                            subValue="通常为负，代表扩张"
                            color="blue"
                            icon={<TrendingUp className="text-blue-600" />}
                        />
                        <MetricCard 
                            title="购建资产支出 (CAPEX)"
                            value={formatCurrency(RAW_DATA.investOutflows.purchaseAssets)}
                            subValue="产能/研发扩建投入"
                            color="amber"
                            icon={<Building2 className="text-amber-600" />}
                        />
                        <MetricCard 
                            title="投资支付 (理财/股权)"
                            value={formatCurrency(RAW_DATA.investOutflows.investmentsPaid)}
                            subValue="闲置资金管理"
                            color="blue"
                            icon={<Banknote className="text-blue-600" />}
                        />
                    </div>

                     {/* Investing Sankey */}
                     <section className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Layers className="text-indigo-600" />
                            投资资金流向 (Investing Flow)
                            </h2>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">数据来源：年报主表及CIP/固资附注分析</span>
                        </div>
                        <SankeyDiagram data={SANKEY_DATA_INVESTING} width={1100} height={400} />
                        <p className="mt-3 text-xs text-gray-500 italic text-center max-w-3xl mx-auto">
                            注：对于成长期制造企业（如德邦），投资活动净流出通常较大，主要用于购建厂房设备（CAPEX）。左侧"资金缺口"表示该部分支出由经营现金流或筹资活动覆盖。
                        </p>
                    </section>

                     {/* Investing Breakdowns */}
                     <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <BreakdownChart 
                            title="投资现金流入 (回收)" 
                            data={INVESTING_INFLOW_ITEMS} 
                            total={RAW_DATA.investInflows.total}
                            layout="horizontal"
                        />
                        <BreakdownChart 
                            title="投资现金流出 (投入)" 
                            data={INVESTING_OUTFLOW_ITEMS} 
                            total={RAW_DATA.investOutflows.total}
                            layout="horizontal"
                        />
                    </section>
                </>
              );
          case 'financing':
            return (
                <>
                    {/* Financing Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <MetricCard 
                            title="筹资活动净现金流"
                            value={formatCurrency(RAW_DATA.netFinancingCashFlow)}
                            subValue="正数代表外部输血"
                            color={RAW_DATA.netFinancingCashFlow >= 0 ? "green" : "amber"}
                            icon={<DollarSign className={RAW_DATA.netFinancingCashFlow >= 0 ? "text-green-600" : "text-amber-600"} />}
                        />
                        <MetricCard 
                            title="取得借款"
                            value={formatCurrency(RAW_DATA.financeInflows.borrowings)}
                            subValue="银行授信使用情况"
                            color="blue"
                            icon={<Banknote className="text-blue-600" />}
                        />
                        <MetricCard 
                            title="偿债与分红支出"
                            value={formatCurrency(RAW_DATA.financeOutflows.repayDebt + RAW_DATA.financeOutflows.dividendsInterest)}
                            subValue="刚性筹资支出"
                            color="red"
                            icon={<ArrowUpRight className="text-red-600" />}
                        />
                    </div>

                     {/* Financing Sankey */}
                     <section className="mb-8">
                        <div className="flex justify-between items-end mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Building2 className="text-teal-600" />
                            筹资资金流向 (Financing Flow)
                            </h2>
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">演示数据 - 请填入真实值</span>
                        </div>
                        <SankeyDiagram data={SANKEY_DATA_FINANCING} width={1100} height={400} />
                    </section>

                     {/* Financing Breakdowns */}
                     <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <BreakdownChart 
                            title="筹资现金流入 (来源)" 
                            data={FINANCING_INFLOW_ITEMS} 
                            total={RAW_DATA.financeInflows.total}
                            layout="horizontal"
                        />
                        <BreakdownChart 
                            title="筹资现金流出 (去向)" 
                            data={FINANCING_OUTFLOW_ITEMS} 
                            total={RAW_DATA.financeOutflows.total}
                            layout="horizontal"
                        />
                    </section>
                </>
              );
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-800 p-2 rounded-lg text-white">
                <Building2 size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">德邦科技 (688035) 现金流透视看板</h1>
                <p className="text-sm text-gray-500">Benchmark：未上市电子胶粘剂企业对标分析系统</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            activeTab === 'overview' 
                            ? 'bg-white text-blue-700 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <LayoutDashboard size={16} />
                        总览
                    </button>
                    {(['operating', 'investing', 'financing'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                                activeTab === tab 
                                ? 'bg-white text-blue-700 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab === 'operating' && '经营活动'}
                            {tab === 'investing' && '投资活动'}
                            {tab === 'financing' && '筹资活动'}
                        </button>
                    ))}
                </div>

                {/* Guide Button */}
                <button
                    onClick={() => setShowGuide(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-sm ml-2"
                >
                    <BookOpen size={16} />
                    <span className="hidden sm:inline">数据抓取指南</span>
                </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {renderContent()}

        {/* Section: Insights (Context Aware) */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="bg-blue-500 w-1 h-6 rounded-full block"></span>
            对标分析建议 (Benchmark Insights) - {activeTab === 'overview' ? '全局视角' : activeTab === 'operating' ? '经营篇' : activeTab === 'investing' ? '投资篇' : '筹资篇'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeTab === 'overview' && (
                <>
                    <div className="space-y-3">
                    <h3 className="font-bold text-blue-300 border-b border-gray-600 pb-2">1. 资金周转 vs 消耗</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        榜首的“购买理财”虽金额巨大，但属于周转性资金。未上市企业应重点关注<strong>排名第二的“购买商品”</strong>和<strong>排名第三的“CAPEX”</strong>，这两项才是真正的现金消耗黑洞。
                    </p>
                    </div>
                    <div className="space-y-3">
                    <h3 className="font-bold text-amber-300 border-b border-gray-600 pb-2">2. 人力成本压力</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        职工薪酬在榜单中位列第5，占比较高。对比贵司的人力成本/营收占比，若显著高于德邦，说明人效可能存在优化空间。
                    </p>
                    </div>
                    <div className="space-y-3">
                    <h3 className="font-bold text-green-300 border-b border-gray-600 pb-2">3. 融资维护与分红平衡</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        关注筹资活动的净流出情况，特别是偿还债务和分配股利的持续性，确保融资渠道畅通。
                    </p>
                    </div>
                </>
            )}
          </div>
        </section>
      </main>

      <BenchmarkGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
};

export default App;