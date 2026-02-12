import React from 'react';
import { Session, SessionStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { QuickActions } from './QuickActions';

interface Props {
  session: Session;
  onClick: () => void;
  onStatusUpdate: (id: string, status: SessionStatus) => void;
  showSummary?: boolean;
  onReschedule?: (session: Session) => void;
}

export const SessionCard: React.FC<Props> = ({ session, onClick, onStatusUpdate, showSummary = false, onReschedule }) => {
  return (
    <tr 
        onClick={onClick}
        className="hover:bg-white transition-all cursor-pointer group border-b border-slate-50 last:border-0"
    >
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
            <div className="relative">
                <div className="absolute inset-0 bg-teal-500/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img src={session.patient.avatarUrl} alt="" className="relative w-10 h-10 rounded-full border border-slate-100 object-cover shadow-sm" />
            </div>
            <div>
                <p className="font-bold text-slate-800 text-sm tracking-tight">{session.patient.name}</p>
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">{session.patient.condition}</p>
            </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex flex-col text-sm">
            <span className="text-slate-800 font-medium">{new Date(session.date).toLocaleDateString()}</span>
            <span className="text-slate-400 text-xs mt-0.5">{new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {session.durationMinutes}m</span>
        </div>
      </td>
      <td className="px-8 py-6 text-center">
        <StatusBadge status={session.status} />
      </td>
      <td className="px-8 py-6">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{session.type}</span>
      </td>
      {showSummary && (
        <td className="px-8 py-6 text-sm text-slate-500 max-w-xs">
          <p className="truncate opacity-60 group-hover:opacity-100 transition-opacity" title={session.clinicalNotes || "No notes"}>
             {session.clinicalNotes || session.aiSummary || "No data recorded"}
          </p>
        </td>
      )}
      <td className="px-8 py-6 text-right">
        <div className="opacity-20 group-hover:opacity-100 transition-opacity inline-block">
            <QuickActions session={session} onStatusUpdate={onStatusUpdate} onReschedule={onReschedule} />
        </div>
      </td>
    </tr>
  );
};