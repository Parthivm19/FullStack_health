import React from 'react';
import { BoxIcon } from 'lucide-react';
interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: BoxIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconBgColor?: string;
}
export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  iconBgColor = 'bg-emerald-100'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
        {trend &&
        <span
          className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        }
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-gray-500 text-sm">{unit}</span>}
      </div>
    </div>);

}