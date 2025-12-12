import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string; // Formatted value to display
    rawValue?: number; // Raw number for calculation
    subValue?: string;
    icon?: React.ReactNode;
    color?: string;
    prevValue?: number; // Comparison value (e.g. 2023)
    prevLabel?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
    title, 
    value, 
    rawValue,
    subValue, 
    icon, 
    color = "blue", 
    prevValue,
    prevLabel = "同比"
}) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-green-50 border-green-200 text-green-900",
    red: "bg-red-50 border-red-200 text-red-900",
    amber: "bg-amber-50 border-amber-200 text-amber-900",
  };

  const selectedColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  let diffContent = null;
  if (rawValue !== undefined && prevValue !== undefined && prevValue !== 0) {
      const diff = (rawValue - prevValue) / Math.abs(prevValue);
      const diffPercent = (diff * 100).toFixed(1) + '%';
      const isPositive = diff > 0;
      const isNeutral = diff === 0;
      
      const diffColor = isPositive ? "text-green-600" : isNeutral ? "text-gray-500" : "text-red-600";
      const DiffIcon = isPositive ? ArrowUp : isNeutral ? Minus : ArrowDown;

      diffContent = (
          <div className={`flex items-center text-xs font-bold ${diffColor} mt-1 bg-white bg-opacity-60 px-1.5 py-0.5 rounded w-fit`}>
              <DiffIcon size={12} className="mr-0.5" />
              {diffPercent} <span className="text-gray-500 font-normal ml-1">({prevLabel})</span>
          </div>
      );
  }

  return (
    <div className={`p-4 rounded-xl border ${selectedColor} shadow-sm transition-all hover:shadow-md h-full flex flex-col justify-between`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-medium opacity-80 mb-1">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          
          {diffContent}
          
          {subValue && <p className="text-xs mt-2 opacity-70 font-medium leading-tight">{subValue}</p>}
        </div>
        {icon && <div className="p-2 bg-white bg-opacity-40 rounded-lg shrink-0 ml-2">{icon}</div>}
      </div>
    </div>
  );
};

export default MetricCard;