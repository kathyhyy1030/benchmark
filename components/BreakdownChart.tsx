import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronRight, ChevronLeft, Info, HelpCircle } from 'lucide-react';
import { CashFlowItem } from '../types';

interface BreakdownChartProps {
  data: CashFlowItem[];
  title: string;
  total: number;
  layout?: 'default' | 'horizontal';
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

const BreakdownChart: React.FC<BreakdownChartProps> = ({ data, title, total, layout = 'default' }) => {
  const [selectedItem, setSelectedItem] = useState<CashFlowItem | null>(null);

  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
    ratio: (item.value / total) * 100,
    description: item.description,
    rawItem: item
  }));

  const formatValue = (value: number) => {
    if (value >= 100000000) {
      return `${(value / 100000000).toFixed(2)} 亿元`;
    } else if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} 千万元`;
    }
    return `${(value / 1000000).toFixed(2)} 百万元`;
  };

  const handleItemClick = (item: CashFlowItem) => {
    if (item.subItems || item.explanation) {
      setSelectedItem(item);
    }
  };

  const handleBack = () => {
    setSelectedItem(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col relative overflow-hidden transition-all">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        {selectedItem && (
          <button 
            onClick={handleBack}
            className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition-colors"
          >
            <ChevronLeft size={16} /> 返回总览
          </button>
        )}
      </div>

      <div className={`flex flex-col ${layout === 'horizontal' ? 'lg:flex-row' : ''} h-full gap-6`}>
        
        {/* Left Side: Chart (Always visible, but dims when detailed view is active) */}
        <div className={`flex-1 min-h-[250px] relative transition-opacity duration-300 ${selectedItem && layout === 'horizontal' ? 'opacity-40 grayscale' : 'opacity-100'}`}>
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data) => handleItemClick(data.rawItem)}
                  className="cursor-pointer"
                >
                {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke={selectedItem?.name === entry.name ? "#000" : "none"}
                      strokeWidth={2}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => [
                        `${formatValue(value)}`, 
                        `占比 ${((value / total) * 100).toFixed(2)}%`
                    ]}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
            </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <p className="text-xs text-gray-400">Total</p>
                    <p className="font-bold text-gray-700">{formatValue(total)}</p>
                </div>
            </div>
        </div>

        {/* Right Side: List OR Detail View */}
        <div className={`${layout === 'horizontal' ? 'lg:w-1/2' : 'mt-4'} relative`}>
            
            {/* Main List View */}
            <div className={`space-y-3 transition-all duration-300 absolute inset-0 overflow-y-auto ${selectedItem ? 'opacity-0 pointer-events-none translate-x-10' : 'opacity-100 translate-x-0'}`}>
                {chartData.map((item, index) => (
                <div 
                    key={index} 
                    onClick={() => handleItemClick(item.rawItem)}
                    className={`flex justify-between items-start text-sm border-b border-gray-50 last:border-0 py-2 px-2 rounded hover:bg-gray-50 transition-colors ${item.rawItem.subItems || item.rawItem.explanation ? 'cursor-pointer group' : ''}`}
                >
                    <div className="flex items-start">
                        <div className="w-3 h-3 rounded-full mr-2 mt-1 shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <div>
                            <span className="text-gray-700 font-medium flex items-center gap-1">
                                {item.name}
                                {(item.rawItem.subItems || item.rawItem.explanation) && <ChevronRight size={14} className="text-gray-300 group-hover:text-blue-500" />}
                            </span>
                            {item.description && <span className="text-xs text-gray-400 block">{item.description}</span>}
                        </div>
                    </div>
                    <div className="flex flex-col items-end whitespace-nowrap ml-2">
                        <span className="font-semibold text-gray-800">
                            {formatValue(item.value).split(' ')[0]} <span className="text-xs font-normal text-gray-500">{formatValue(item.value).split(' ')[1]}</span>
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{item.ratio.toFixed(2)}%</span>
                    </div>
                </div>
                ))}
            </div>

            {/* Detailed Drill-Down View */}
            <div className={`absolute inset-0 bg-white transition-all duration-300 flex flex-col ${selectedItem ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
                {selectedItem && (
                    <div className="h-full overflow-y-auto pr-2">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[chartData.findIndex(i => i.name === selectedItem.name) % COLORS.length] }}></div>
                            <h4 className="font-bold text-gray-800">{selectedItem.name} 详情</h4>
                        </div>

                        {/* Logic Explanation Box */}
                        {selectedItem.explanation && (
                            <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg mb-4">
                                <div className="flex items-start gap-2">
                                    <HelpCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-800 leading-relaxed whitespace-pre-line">
                                        {selectedItem.explanation}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Sub-Items List */}
                        {selectedItem.subItems && (
                            <div className="space-y-3">
                                {selectedItem.subItems.map((sub, idx) => {
                                    const globalRatio = ((sub.value / total) * 100).toFixed(2);
                                    const parentRatio = ((sub.value / selectedItem.value) * 100).toFixed(1);
                                    
                                    return (
                                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">{sub.name}</p>
                                                <p className="text-xs text-gray-400">{sub.description}</p>
                                            </div>
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-sm font-bold text-gray-800">{formatValue(sub.value)}</p>
                                                <div className="flex flex-col items-end mt-1">
                                                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded" title="占总流入/流出的比例">
                                                        总占比: {globalRatio}%
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 mt-0.5">
                                                        (占{selectedItem.name}: {parentRatio}%)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <p className="text-[10px] text-center text-gray-400 mt-4 italic">
                                    注：细分数据基于行业标准模型估算
                                </p>
                            </div>
                        )}

                        {!selectedItem.subItems && !selectedItem.explanation && (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                暂无更多细分数据
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default BreakdownChart;