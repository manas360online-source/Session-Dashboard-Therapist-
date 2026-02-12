import React, { useState, useEffect } from 'react';
import { Session } from '../types';
import { X, Calendar, Clock, ArrowRight } from 'lucide-react';

interface Props {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionId: string, newDate: string, newTime: string) => void;
}

export const RescheduleModal: React.FC<Props> = ({ session, isOpen, onClose, onSave }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (session && isOpen) {
        const d = new Date(session.date);
        setDate(d.toISOString().split('T')[0]);
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
    }
  }, [session, isOpen]);

  if (!isOpen || !session) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(session.id, date, time);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">Reschedule Session</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                    <X size={20} />
                </button>
            </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-2">Current Appointment</p>
                    <div className="flex items-center gap-2 text-blue-900 font-medium mb-1">
                        <Calendar size={16} className="text-blue-500" />
                        <span>{new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="text-sm text-blue-700">
                        Patient: {session.patient.name}
                    </div>
                </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="date" 
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-700"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="time" 
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2 gap-3">
                     <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                     <button 
                        type="submit"
                        className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        Confirm Reschedule <ArrowRight size={16} />
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};