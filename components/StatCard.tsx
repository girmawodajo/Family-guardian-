
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend }) => {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:translate-y-[-10px] hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] group relative overflow-hidden">
      <div className="flex items-center justify-between mb-10 relative z-10">
        <div className={`w-16 h-16 rounded-[1.75rem] ${color} flex items-center justify-center text-white text-3xl shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3`}>
          <i className={`fas ${icon}`}></i>
        </div>
        {trend && (
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest ${trend.includes('+') ? 'bg-red-50 text-red-600 shadow-sm shadow-red-100' : 'bg-green-50 text-green-600 shadow-sm shadow-green-100'}`}>
            <i className={`fas ${trend.includes('+') ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down'}`}></i>
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-3">{label}</h3>
        <p className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-indigo-600 transition-colors">{value}</p>
      </div>
      {/* Dynamic Glow Effect */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-all duration-500 blur-3xl ${color}`}></div>
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
         <i className="fas fa-ellipsis-v text-slate-300"></i>
      </div>
    </div>
  );
};

export default StatCard;
