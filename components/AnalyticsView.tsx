import React, { useMemo } from 'react';
import { Session, SessionStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Props {
  sessions: Session[];
}

const CompletionRate: React.FC<{ rate: number, data: any[] }> = ({ rate, data }) => {
    const COLORS = ['#0d9488', '#2563eb', '#dc2626', '#d97706', '#7c3aed'];
    return (
        <div className="calm-card p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative bg-white/80">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl pointer-events-none"></div>
            <div className="flex justify-between items-start mb-8">
                 <div>
                    <h3 className="serif-heading text-xl font-bold text-slate-800 mb-1">Clinical Outcomes</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Success Metrics</p>
                 </div>
                 <div className="text-right">
                    <span className="text-3xl font-black text-teal-600">{rate}%</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Success Rate</p>
                 </div>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                    >
                        {data.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', color: '#1e293b', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                        itemStyle={{color: '#475569', fontSize: '12px'}}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const AverageTime: React.FC<{ average: number, data: any[] }> = ({ average, data }) => (
    <div className="calm-card p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative bg-white/80">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none"></div>
        <div className="flex justify-between items-start mb-8">
             <div>
                <h3 className="serif-heading text-xl font-bold text-slate-800 mb-1">Session Volume</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Engagement Depth</p>
             </div>
             <div className="text-right">
                <span className="text-3xl font-black text-blue-600">{average}m</span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Avg Duration</p>
             </div>
        </div>
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="date" tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={10}/>
                <YAxis tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} axisLine={false} tickLine={false}/>
                <Tooltip 
                    cursor={{fill: '#f8fafc', radius: 8}}
                    contentStyle={{backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', color: '#1e293b', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="duration" fill="#2563eb" radius={[10, 10, 10, 10]} barSize={24} name="Minutes"/>
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

export const AnalyticsView: React.FC<Props> = ({ sessions }) => {
  const statusData = useMemo(() => {
    const counts = sessions.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  }, [sessions]);

  const durationData = useMemo(() => {
      return sessions
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(s => ({
          date: new Date(s.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
          duration: s.durationMinutes
        })).slice(-7);
  }, [sessions]);

  const completionRate = useMemo(() => {
      if (sessions.length === 0) return 0;
      const completed = sessions.filter(s => s.status === SessionStatus.COMPLETED).length;
      return Math.round((completed / sessions.length) * 100);
  }, [sessions]);

  const avgTime = useMemo(() => {
      if (sessions.length === 0) return 0;
      const total = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      return Math.round(total / sessions.length);
  }, [sessions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <CompletionRate rate={completionRate} data={statusData} />
      <AverageTime average={avgTime} data={durationData} />
    </div>
  );
};