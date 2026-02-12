import React from 'react';
import { SessionStatus } from '../types';

export const StatusBadge: React.FC<{ status: SessionStatus }> = ({ status }) => {
  const styles = {
      [SessionStatus.COMPLETED]: 'bg-teal-50 text-teal-700 border-teal-100',
      [SessionStatus.SCHEDULED]: 'bg-blue-50 text-blue-700 border-blue-100',
      [SessionStatus.ONGOING]: 'bg-purple-50 text-purple-700 border-purple-100 animate-pulse',
      [SessionStatus.CANCELLED]: 'bg-red-50 text-red-700 border-red-100',
      [SessionStatus.MISSED]: 'bg-slate-50 text-slate-700 border-slate-100',
    };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${styles[status].split(' ')[1].replace('text-', 'bg-')}`}></span>
      {status}
    </span>
  );
};