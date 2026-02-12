import React, { useState, useMemo } from 'react';
import { Session, SessionStatus } from '../types';
import { Search, Filter, Printer, FileDown, Clock, Calendar } from 'lucide-react';
import { SessionCard } from './SessionCard';
import { QuickActions } from './QuickActions';

interface Props {
  sessions: Session[];
  onSelectSession: (session: Session) => void;
  onStatusUpdate: (id: string, status: SessionStatus) => void;
  title?: string;
  showSummary?: boolean;
  onReschedule?: (session: Session) => void;
}

export const SessionList: React.FC<Props> = ({ sessions, onSelectSession, onStatusUpdate, title = "Session Records", showSummary = false, onReschedule }) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      const matchesStatus = filterStatus === 'All' || session.status === filterStatus;
      const matchesSearch = session.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            session.patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [sessions, filterStatus, searchTerm]);

  const handleExportCSV = () => {
    const headers = ["Session ID", "Date", "Patient Name", "Status", "Duration (min)", "Type", "Notes"];
    const rows = filteredSessions.map(s => [
      s.id, s.date, s.patient.name, s.status, s.durationMinutes, s.type, `"${s.clinicalNotes.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sessions_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="calm-card rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl flex flex-col bg-white/70">
      {/* Toolbar */}
      <div className="px-8 py-6 border-b border-slate-50 flex flex-col md:flex-row gap-6 justify-between items-center bg-white/30">
        <div className="flex items-center gap-6 w-full md:w-auto">
          {title && <h2 className="serif-heading text-lg font-bold text-slate-800 hidden lg:block mr-2 uppercase tracking-widest">{title}</h2>}
          <div className="relative flex-1 md:w-64 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white/80 border border-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/10 text-sm text-slate-700 placeholder-slate-400 shadow-inner"
            />
          </div>
          
          <div className="relative">
             <select
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="pl-4 pr-10 py-2.5 bg-white/80 border border-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/10 text-sm text-slate-700 appearance-none cursor-pointer hover:bg-white transition-all shadow-inner"
             >
               <option value="All">All Events</option>
               {Object.values(SessionStatus).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="p-3 text-slate-400 hover:text-slate-800 bg-white hover:bg-slate-50 rounded-full transition-all border border-slate-100 shadow-sm" title="Print View">
                <Printer size={18} />
            </button>
            <button 
                onClick={handleExportCSV}
                className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-teal-700 transition-all shadow-lg active:scale-95 shadow-teal-500/10"
            >
                <FileDown size={16} /> Export
            </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-slate-400 text-[10px] uppercase tracking-[0.2em] bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 font-bold">Patient Profile</th>
              <th className="px-8 py-5 font-bold">Schedule</th>
              <th className="px-8 py-5 font-bold text-center">Status</th>
              <th className="px-8 py-5 font-bold">Modality</th>
              {showSummary && <th className="px-8 py-5 font-bold">Notes Preview</th>}
              <th className="px-8 py-5 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <SessionCard 
                    key={session.id} 
                    session={session} 
                    onClick={() => onSelectSession(session)} 
                    onStatusUpdate={onStatusUpdate}
                    showSummary={showSummary}
                    onReschedule={onReschedule}
                />
              ))
            ) : (
                <tr>
                    <td colSpan={showSummary ? 6 : 5} className="text-center py-24 text-slate-400 italic">
                        No matches found in your clinical records.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View remains functional with light theme */}
      <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
        {filteredSessions.map(session => (
            <div key={session.id} onClick={() => onSelectSession(session)} className="calm-card p-6 border border-slate-100 bg-white relative">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                         <img src={session.patient.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                         <h3 className="font-bold text-slate-800">{session.patient.name}</h3>
                    </div>
                 </div>
                 <div className="flex gap-4 text-xs text-slate-500 mb-4">
                     <div className="flex items-center gap-1"><Calendar size={14}/> {new Date(session.date).toLocaleDateString()}</div>
                     <div className="flex items-center gap-1"><Clock size={14}/> {session.durationMinutes}m</div>
                 </div>
                 <QuickActions session={session} onStatusUpdate={onStatusUpdate} onReschedule={onReschedule} />
            </div>
        ))}
      </div>
    </div>
  );
};