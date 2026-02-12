import React, { useState } from 'react';
import { Patient, Session } from '../types';
import { X, Calendar, Clock, User, FileText, Plus, UserCheck, ChevronLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionData: any) => void;
  patients: Patient[];
}

export const NewAppointmentModal: React.FC<Props> = ({ isOpen, onClose, onSave, patients }) => {
  const [patientId, setPatientId] = useState('');
  const [isNewPatient, setIsNewPatient] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [type, setType] = useState<Session['type']>('In-Person');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNewPatient && !patientId) return;

    onSave({
      patientId: isNewPatient ? null : patientId,
      newPatient: isNewPatient ? {
          name: newName,
          age: Number(newAge),
          condition: newCondition,
          email: newEmail,
          phone: newPhone
      } : null,
      date,
      time,
      durationMinutes: duration,
      type,
      clinicalNotes: notes
    });

    setPatientId('');
    setIsNewPatient(false);
    setNewName('');
    setNewAge('');
    setNewCondition('');
    setNewEmail('');
    setNewPhone('');
    setDate('');
    setTime('');
    setNotes('');
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue/10 focus:outline-none text-brand-navy placeholder-slate-400 transition-all text-sm shadow-sm";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-blue"></div>
        
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <h2 className="serif-heading text-2xl font-bold text-brand-navy uppercase tracking-tight">
                {isNewPatient ? 'New Patient Enrollment' : 'Schedule Session'}
            </h2>
            <button onClick={onClose} className="p-2.5 bg-white hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-brand-navy border border-slate-100 shadow-sm">
                <X size={20} />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="bg-brand-blue/5 p-6 rounded-[2rem] border border-brand-blue/5 transition-all">
                {!isNewPatient ? (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                             <label className={labelClass}>Select Patient</label>
                             <button 
                                type="button" 
                                onClick={() => setIsNewPatient(true)}
                                className="text-[10px] text-brand-blue font-black hover:underline flex items-center gap-1 uppercase tracking-widest"
                             >
                                <Plus size={12}/> Create Profile
                             </button>
                        </div>
                        <div className="relative">
                            <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <select 
                                required={!isNewPatient}
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue/10 focus:outline-none appearance-none text-brand-navy text-sm cursor-pointer shadow-sm"
                            >
                                <option value="">-- Search Registry --</option>
                                {patients.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="animate-calm space-y-4">
                         <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xs font-black text-brand-navy flex items-center gap-2 uppercase tracking-widest">
                                <User size={14} className="text-brand-blue"/> New Profile
                             </h3>
                             <button 
                                type="button" 
                                onClick={() => setIsNewPatient(false)}
                                className="text-[10px] text-slate-400 font-bold hover:text-brand-blue flex items-center gap-1 uppercase tracking-widest"
                             >
                                <ChevronLeft size={12}/> Registry
                             </button>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Patient Full Name"
                            required={isNewPatient}
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className={inputClass}
                        />
                         <div className="grid grid-cols-2 gap-4">
                            <input 
                                type="number" 
                                placeholder="Age"
                                value={newAge}
                                onChange={(e) => setNewAge(e.target.value)}
                                className={inputClass.replace('pl-10', 'px-4')}
                            />
                            <input 
                                type="text" 
                                placeholder="Diagnosis"
                                value={newCondition}
                                onChange={(e) => setNewCondition(e.target.value)}
                                className={inputClass.replace('pl-10', 'px-4')}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className={inputClass.replace('pl-10', 'px-4')} />
                </div>
                <div>
                    <label className={labelClass}>Start Time</label>
                    <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={inputClass.replace('pl-10', 'px-4')} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>Duration</label>
                    <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={inputClass.replace('pl-10', 'px-4')}>
                        <option value={30}>30 Min</option>
                        <option value={45}>45 Min</option>
                        <option value={60}>60 Min</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as any)} className={inputClass.replace('pl-10', 'px-4')}>
                        <option value="In-Person">In-Person</option>
                        <option value="Video">Telehealth</option>
                    </select>
                </div>
            </div>

            <div>
                 <label className={labelClass}>Session Focus</label>
                 <textarea 
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-blue/10 focus:outline-none resize-none text-brand-navy text-sm shadow-sm"
                    placeholder="Initial clinical observations..."
                />
            </div>

            <div className="pt-8 flex justify-end gap-4 bg-transparent border-t border-slate-50">
                <button type="button" onClick={onClose} className="px-6 py-2.5 text-slate-400 font-bold hover:text-brand-navy transition-colors">Cancel</button>
                <button type="submit" className="btn-brand px-10 py-3.5 text-sm">Schedule Session</button>
            </div>
        </form>
      </div>
    </div>
  );
};