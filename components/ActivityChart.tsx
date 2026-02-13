
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Mon', time: 120 },
  { name: 'Tue', time: 180 },
  { name: 'Wed', time: 150 },
  { name: 'Thu', time: 240 },
  { name: 'Fri', time: 210 },
  { name: 'Sat', time: 300 },
  { name: 'Sun', time: 280 },
];

const ActivityChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-80">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800">Weekly Screen Time (Avg)</h3>
        <select className="text-xs border-none bg-slate-100 rounded-md px-2 py-1 outline-none">
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <Tooltip 
            cursor={{fill: '#f8fafc'}}
            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
          />
          <Bar dataKey="time" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.time > 200 ? '#6366f1' : '#a5b4fc'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
