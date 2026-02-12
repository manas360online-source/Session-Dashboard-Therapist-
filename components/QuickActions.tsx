import React from 'react';
import { Play, CalendarX, CheckCircle, MoreVertical, CalendarClock } from 'lucide-react';
import { Session, SessionStatus } from '../types';

interface Props {
    session: Session;
    onStatusUpdate: (id: string, status: SessionStatus) => void;
    onReschedule?: (session: Session) => void;
}

export const QuickActions: React.FC<Props> = ({ session, onStatusUpdate, onReschedule }) => {
    return (
        <div className="flex items-center gap-1 justify-end">
             {session.status === SessionStatus.SCHEDULED && (
                 <>
                    <button 
                        title="Start Session" 
                        onClick={(e) => { e.stopPropagation(); onStatusUpdate(session.id, SessionStatus.ONGOING)}} 
                        className="p-1.5 hover:bg-purple-100 text-purple-600 rounded-md transition-colors"
                    >
                        <Play size={16} />
                    </button>
                    {onReschedule && (
                        <button 
                            title="Reschedule" 
                            onClick={(e) => { e.stopPropagation(); onReschedule(session)}} 
                            className="p-1.5 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                        >
                            <CalendarClock size={16} />
                        </button>
                    )}
                    <button 
                        title="Cancel" 
                        onClick={(e) => { e.stopPropagation(); onStatusUpdate(session.id, SessionStatus.CANCELLED)}} 
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded-md transition-colors"
                    >
                        <CalendarX size={16} />
                    </button>
                 </>
             )}
             {session.status === SessionStatus.ONGOING && (
                 <button 
                    title="Complete" 
                    onClick={(e) => { e.stopPropagation(); onStatusUpdate(session.id, SessionStatus.COMPLETED)}} 
                    className="p-1.5 hover:bg-green-100 text-green-600 rounded-md transition-colors"
                >
                    <CheckCircle size={16} />
                </button>
             )}
             <button className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-md">
                 <MoreVertical size={16} />
             </button>
        </div>
    );
};