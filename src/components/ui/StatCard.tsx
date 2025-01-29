import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend: number;
  iconColor?: string;
}

function StatCard({ icon: Icon, label, value, trend, iconColor = 'text-primary' }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${trend >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
          {trend}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last month</span>
      </div>
    </div>
  );
}

export default StatCard;
