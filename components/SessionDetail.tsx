import React, { useState } from 'react';
import { Session, SessionStatus, SessionResponse } from '../types';
import { Calendar, Clock, User, FileText, Activity, FileDown, CheckCircle, AlertCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { generateSessionSummary } from '../services/geminiService';

// Subcomponents exported for reuse in Patient History View
export const PatientInfo: React.FC<{ session: Session }> = ({ session }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Calendar size={14} className="text-teal-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Date</span>
            </div>
            <p className="font-bold text-white text-lg">{new Date(session.date).toLocaleDateString()}</p>
        </div>
        <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Clock size={14} className="text-teal-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Time Schedule</span>
            </div>
            <p className="font-bold text-white text-lg">
                {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                <span className="text-sm font-medium text-slate-500 ml-2">({session.durationMinutes} min)</span>
            </p>
        </div>
        <div className="md:col-span-2 p-6 bg-white/5 rounded-2xl border border-white/5">
            <h3 className="text-[10px] font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                <User size={14} className="text-teal-400" /> Clinical Contact Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <span className="text-slate-500 block text-xs mb-1">Registered Email</span>
                    <span className="text-white font-bold">{session.patient.email}</span>
                </div>
                <div>
                    <span className="text-slate-500 block text-xs mb-1">Direct Phone</span>
                    <span className="text-white font-bold">{session.patient.phone}</span>
                </div>
            </div>
        </div>
    </div>
);

export const ResponseList: React.FC<{ responses: SessionResponse[], isDarkMode?: boolean }> = ({ responses, isDarkMode = true }) => (
    <div className="space-y-6">
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>Patient Feedback History</h3>
        {responses.length === 0 ? (
            <div className="text-center py-10 text-slate-500 border-2 border-dashed border-white/5 rounded-2xl bg-white/5 italic text-sm">
                <p>No qualitative feedback recorded for this period.</p>
            </div>
        ) : (
            responses.map((response, index) => (
                <div key={index} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{new Date(response.timestamp).toLocaleDateString()} • {new Date(response.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                        {response.moodRating && (
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${response.moodRating >= 7 ? 'bg-teal-500/10 text-teal-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                Mood Index: {response.moodRating}
                            </span>
                        )}
                    </div>
                    <p className="text-sm font-bold text-white mb-2 leading-tight">{response.question}</p>
                    <p className="text-slate-400 bg-slate-950/50 p-4 rounded-xl border border-white/5 text-sm leading-relaxed italic group-hover:text-slate-200 transition-colors">
                        "{response.answer}"
                    </p>
                </div>
            ))
        )}
    </div>
);

const ExportButton: React.FC<{ session: Session }> = ({ session }) => (
    <button 
        onClick={() => {
            const data = JSON.stringify(session, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `session_${session.id}.json`;
            link.click();
        }}
        className="w-full mt-8 flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all border border-white/5 shadow-xl active:scale-95"
    >
        <FileDown size={16} className="text-teal-400"/> Download Clinical PDF
    </button>
);

interface Props {
    session: Session;
    onUpdateStatus: (id: string, status: SessionStatus) => void;
}

export const SessionDetail: React.FC<Props> = ({ session, onUpdateStatus }) => {
    const [summary, setSummary] = useState<string | null>(session.aiSummary || null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleGenerateSummary = async () => {
        setIsGenerating(true);
        const result = await generateSessionSummary(session);
        setSummary(result);
        setIsGenerating(false);
        setIsCollapsed(false);
    };

    return (
        <div className="space-y-10">
            <PatientInfo session={session} />
            
            {/* AI Summary Section */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-500/20 rounded-[2rem] overflow-hidden transition-all shadow-2xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none"></div>
                <div 
                    className="p-8 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/20">
                             <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg tracking-tight">Clinical AI Insight</h3>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-0.5">
                                {summary ? 'Deep Analysis Complete' : 'Awaiting Synthesis'}
                            </p>
                        </div>
                     </div>
                     <button className="text-indigo-400 hover:text-white transition-all p-2 bg-white/5 rounded-full">
                         {isCollapsed ? <ChevronDown size={20}/> : <ChevronUp size={20}/>}
                     </button>
                </div>
                
                {!isCollapsed && (
                    <div className="px-8 pb-8 animate-fade-in border-t border-white/5 pt-8">
                        {!summary ? (
                             <div className="text-center py-4">
                                <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed font-medium">
                                    Synthesize clinical notes and patient dialogue into a professional medical summary using Gemini AI.
                                </p>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleGenerateSummary(); }}
                                    disabled={isGenerating}
                                    className="bg-white text-slate-900 px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-wait flex items-center gap-2 mx-auto"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} /> Synthesize Summary
                                        </>
                                    )}
                                </button>
                             </div>
                        ) : (
                            <div className="bg-slate-950/50 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-slate-200 text-sm leading-relaxed shadow-inner font-medium">
                                {summary}
                                <div className="mt-6 pt-6 border-t border-white/5 flex justify-end">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleGenerateSummary(); }}
                                        className="text-[10px] font-black text-indigo-400 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors"
                                    >
                                        <Sparkles size={12}/> Regenerate Insights
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-orange-500/5 border border-orange-500/10 p-8 rounded-[2rem] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-3xl pointer-events-none"></div>
                 <h3 className="text-orange-400 font-black mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                   <FileText size={16} /> Raw Clinical Notes
                 </h3>
                 <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed italic">
                   {session.clinicalNotes || "No preliminary clinical notes have been captured for this engagement."}
                 </p>
            </div>

            <ResponseList responses={session.patientResponses} />
            
            <ExportButton session={session} />

             {/* Action Control */}
             <div className="pt-10 border-t border-white/5">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Workflow Governance</h4>
                <div className="flex gap-4">
                  {session.status === SessionStatus.SCHEDULED || session.status === SessionStatus.ONGOING ? (
                    <>
                      <button 
                        onClick={() => onUpdateStatus(session.id, SessionStatus.COMPLETED)}
                        className="flex-1 bg-teal-600 hover:bg-teal-500 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/10"
                      >
                        <CheckCircle size={18} /> Finalize Records
                      </button>
                      <button 
                         onClick={() => onUpdateStatus(session.id, SessionStatus.CANCELLED)}
                         className="flex-1 bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/5 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                      >
                        <AlertCircle size={18} /> Void Session
                      </button>
                    </>
                  ) : (
                      <div className="w-full text-center py-6 bg-white/5 rounded-2xl border border-white/5 italic text-slate-500 text-xs font-bold uppercase tracking-widest">
                         Archived Session Record • Read Only
                      </div>
                  )}
                </div>
            </div>
        </div>
    );
};