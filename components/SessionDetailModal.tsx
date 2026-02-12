import React from 'react';
import { Session, SessionStatus } from '../types';
import { X, Video, MapPin } from 'lucide-react';
import { SessionDetail } from './SessionDetail';
import { StatusBadge } from './StatusBadge';

interface Props {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: SessionStatus) => void;
}

export const SessionDetailModal: React.FC<Props> = ({ session, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue"></div>
        
        <div className="p-10 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <StatusBadge status={session.status} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
                {session.type === 'Video' ? <Video size={12} className="text-brand-blue"/> : <MapPin size={12} className="text-brand-blue"/>}
                {session.type} Mode
              </span>
            </div>
            <h2 className="serif-heading text-4xl font-bold text-brand-navy mb-2">{session.patient.name}</h2>
            <p className="text-sm text-brand-blue font-bold uppercase tracking-widest">{session.patient.condition}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-brand-navy border border-slate-100 shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 bg-transparent custom-scrollbar">
            <SessionDetail session={session} onUpdateStatus={onUpdateStatus} />
        </div>
      </div>
    </div>
  );
};