import React from 'react';
import { X, FileText, Search, Table, ArrowRight, Target } from 'lucide-react';

interface BenchmarkGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const BenchmarkGuide: React.FC<BenchmarkGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Target className="text-blue-600" />
                    对标企业数据抓取指南
                </h2>
                <p className="text-xs text-gray-500 mt-1">如何从上市企业年报中提取关键现金流数据以用于看板对比</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
            </button>
        </div>
        
        <div className="p-6 space-y-8 overflow-y-auto">
            
            {/* 核心问题：CAPEX 拆解 */}
            <section className="bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
                <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                    <Search className="text-amber-600" size={24} />
                    CAPEX (资本性支出) 去哪了？
                </h3>
                <p className="text-sm text-amber-800 mb-6 leading-relaxed">
                    在现金流量表主表中，你只能看到一行总数：“购建固定资产、无形资产和其他长期资产支付的现金”。
                    要分析具体流向（是盖楼、买地还是买设备），必须查阅<strong>“财务报表附注”</strong>。
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-amber-200">
                        <div className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">Step 1</span>
                            在建工程 (CIP)
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                            <strong>查阅位置：</strong>附注 > 合并财务报表项目注释 > 在建工程 > <strong>重要在建工程项目本期变动情况</strong>。
                        </p>
                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 border border-gray-100">
                            <strong>抓取重点：</strong>看具体的项目名称（如“烟台产业园”）和“本期增加金额”。这是产能扩张的主力。
                        </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-amber-200">
                         <div className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">Step 2</span>
                            固定资产 (Fixed Assets)
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                            <strong>查阅位置：</strong>附注 > 固定资产 > 固定资产情况表。
                        </p>
                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 border border-gray-100">
                            <strong>抓取重点：</strong>看“本期增加”下的<strong>“购置”</strong>列。这代表直接买回来的设备（如检测仪器、办公电脑）。
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-amber-200">
                         <div className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-xs">Step 3</span>
                            无形资产 (Intangible)
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                            <strong>查阅位置：</strong>附注 > 无形资产。
                        </p>
                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-500 border border-gray-100">
                            <strong>抓取重点：</strong>土地使用权购置（买地费）和软件购置费通常在这里。
                        </div>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 经营活动抓取 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">
                        经营活动现金流 (Operating)
                    </h3>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600"><FileText size={14}/></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-700">销售商品收到的现金</h4>
                                <p className="text-xs text-gray-500">主表直接获取。通常约等于：营业收入 × (1+增值税率) - 应收账款增加额。</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 bg-blue-100 p-1 rounded text-blue-600"><FileText size={14}/></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-700">其他经营活动有关的现金</h4>
                                <p className="text-xs text-gray-500">
                                    必须看<strong>附注</strong>。通常包含：政府补助、利息收入（银行存款）、往来款（保证金）。
                                    <br/>如果是流出，通常包含：研发费用(付现部分)、销售费用(差旅/广告)、管理费用(办公)。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 筹资活动抓取 */}
                <section>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">
                        筹资活动现金流 (Financing)
                    </h3>
                    <div className="space-y-3">
                        <div className="flex gap-3 items-start">
                            <div className="mt-1 bg-green-100 p-1 rounded text-green-600"><FileText size={14}/></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-700">支付其他与筹资有关的现金</h4>
                                <p className="text-xs text-gray-500">
                                    这是一个容易被忽视的“暗坑”。务必查阅附注。
                                    <br/>常见内容：<strong>股份回购</strong>、租赁负债支付（付房租）、上市发行费用、收购少数股东股权。
                                </p>
                            </div>
                        </div>
                         <div className="flex gap-3 items-start">
                            <div className="mt-1 bg-green-100 p-1 rounded text-green-600"><FileText size={14}/></div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-700">理财产品与结构性存款</h4>
                                <p className="text-xs text-gray-500">
                                    有的公司将其计入“投资活动”，有的计入“经营活动”或“筹资”。德邦将其计入<strong>投资活动</strong>（收回投资/投资支付）。
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl text-center">
            <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg text-sm font-medium transition-colors">
                我已了解，开始分析
            </button>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkGuide;