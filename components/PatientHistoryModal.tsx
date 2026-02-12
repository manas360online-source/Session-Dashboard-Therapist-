import React, { useMemo, useState } from 'react';
import { Patient, Session, SessionStatus } from '../types';
import { SessionList } from './SessionList';
import { ResponseList } from './SessionDetail';
import { X, User, Mail, Phone, Calendar } from 'lucide-react';
import { predictPatientOutcome } from '../services/geminiService';
import { PredictionSection } from './PredictionSection';

interface Props {
    patient: Patient | null;
    sessions: Session[];
    isOpen: boolean;
    onClose: () => void;
    onSelectSession: (s: Session) => void;
    onStatusUpdate: (id: string, s: SessionStatus) => void;
}

export const PatientHistoryModal: React.FC<Props> = ({ patient, sessions, isOpen, onClose, onSelectSession, onStatusUpdate }) => {
    const [prediction, setPrediction] = useState<string | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);

    React.useEffect(() => {
        setPrediction(null);
        setIsPredicting(false);
    }, [isOpen, patient?.id]);

    const patientSessions = useMemo(() => {
        if (!patient) return [];
        return sessions
            .filter(s => s.patientId === patient.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [sessions, patient]);

    const allResponses = useMemo(() => {
        return patientSessions.flatMap(s => s.patientResponses).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [patientSessions]);

    if (!isOpen || !patient) return null;

    const handlePredict = async () => {
        setIsPredicting(true);
        const result = await predictPatientOutcome(patient, patientSessions);
        setPrediction(result);
        setIsPredicting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-xl animate-fade-in">
            <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl w-full max-w-7xl h-[92vh] flex flex-col overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue"></div>
                
                <div className="p-10 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
                     <div className="flex items-center gap-8">
                        <img src={patient.avatarUrl} className="w-24 h-24 rounded-full border-4 border-white shadow-2xl bg-slate-50 object-cover" />
                        <div>
                            <h2 className="serif-heading text-4xl font-bold text-brand-navy mb-2">{patient.name}</h2>
                            <div className="flex items-center gap-4">
                                <span className="text-brand-blue font-bold text-xs uppercase tracking-[0.2em]">{patient.condition}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                <span className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Patient Record</span>
                            </div>
                        </div>
                     </div>
                     <button onClick={onClose} className="p-3 bg-white hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-brand-navy border border-slate-100 shadow-sm">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-10 bg-transparent custom-scrollbar">
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-10">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <HistoryStat label="Age" value={patient.age} icon={<User size={16}/>} />
                                <HistoryStat label="Registered" value={patient.email} icon={<Mail size={16}/>} isTruncated />
                                <HistoryStat label="Contact" value={patient.phone} icon={<Phone size={16}/>} />
                            </div>

                            <div className="min-h-[500px]">
                                <SessionList 
                                    sessions={patientSessions} 
                                    onSelectSession={onSelectSession} 
                                    onStatusUpdate={onStatusUpdate}
                                    title="Engagement History"
                                    showSummary={true}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-10">
                            <PredictionSection 
                                prediction={prediction}
                                isLoading={isPredicting}
                                onRunPrediction={handlePredict}
                                onReset={() => setPrediction(null)}
                                canPredict={patientSessions.length > 0}
                            />
                             <div className="calm-card p-8 bg-white/60 border-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                                <ResponseList responses={allResponses} isDarkMode={false} />
                             </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

const HistoryStat = ({ label, value, icon, isTruncated }: { label: string, value: string | number, icon: React.ReactNode, isTruncated?: boolean }) => (
    <div className="calm-card px-6 py-4 border-slate-50 flex items-center gap-4 bg-white/50">
        <div className="p-2.5 bg-brand-blue/5 rounded-xl text-brand-blue border border-brand-blue/10">
            {icon}
        </div>
        <div className="overflow-hidden">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-bold text-brand-navy ${isTruncated ? 'truncate' : ''}`}>{value}</p>
        </div>
    </div>
);