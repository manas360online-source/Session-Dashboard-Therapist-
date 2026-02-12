import React, { useState, useEffect, useMemo } from 'react';
import { generateMockSessions } from './services/mockData';
import { Session, SessionStatus, DashboardStats, Patient } from './types';
import { SessionList } from './components/SessionList';
import { SessionDetailModal } from './components/SessionDetailModal';
import { PatientHistoryModal } from './components/PatientHistoryModal';
import { NewAppointmentModal } from './components/NewAppointmentModal';
import { RescheduleModal } from './components/RescheduleModal';
import { AnalyticsView } from './components/AnalyticsView';
import { LayoutDashboard, Calendar, Users, Settings, Activity, Sparkles, Search, Printer, FileDown } from 'lucide-react';
import { analyzeTrends } from './services/geminiService';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNewApptOpen, setIsNewApptOpen] = useState(false);
  const [reschedulingSession, setReschedulingSession] = useState<Session | null>(null);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [globalInsight, setGlobalInsight] = useState<string | null>(null);

  useEffect(() => {
    const data = generateMockSessions();
    setSessions(data);
  }, []);

  const uniquePatients = useMemo(() => {
    const map = new Map<string, Patient>();
    sessions.forEach(s => {
        if (s.patient && !map.has(s.patient.id)) {
            map.set(s.patient.id, s.patient);
        }
    });
    return Array.from(map.values());
  }, [sessions]);

  const stats: DashboardStats = {
    totalSessions: sessions.length,
    completionRate: Math.round((sessions.filter(s => s.status === SessionStatus.COMPLETED).length / sessions.length) * 100) || 0,
    averageDuration: Math.round(sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0) / sessions.length) || 0,
    upcomingCount: sessions.filter(s => s.status === SessionStatus.SCHEDULED).length
  };

  const handleSessionSelect = (session: Session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (id: string, newStatus: SessionStatus) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    if (selectedSession && selectedSession.id === id) {
      setSelectedSession({ ...selectedSession, status: newStatus });
    }
  };

  const handleRescheduleClick = (session: Session) => setReschedulingSession(session);

  const handleRescheduleSave = (sessionId: string, newDate: string, newTime: string) => {
      const dateTime = new Date(`${newDate}T${newTime}`);
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, date: dateTime.toISOString() } : s));
      setReschedulingSession(null);
  };

  const handleCreateAppointment = (data: any) => {
    let patient: Patient | undefined;
    if (data.newPatient) {
        patient = {
            id: `p${Date.now()}`,
            name: data.newPatient.name,
            age: data.newPatient.age,
            condition: data.newPatient.condition,
            email: data.newPatient.email,
            phone: data.newPatient.phone,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.newPatient.name)}&background=random&color=fff`
        };
    } else {
        patient = uniquePatients.find(p => p.id === data.patientId);
    }
    if (!patient) return;

    const dateTime = new Date(`${data.date}T${data.time}`);
    const newSession: Session = {
        id: `s${Date.now()}`,
        patientId: patient.id,
        patient: patient,
        date: dateTime.toISOString(),
        durationMinutes: data.durationMinutes,
        status: SessionStatus.SCHEDULED,
        type: data.type,
        clinicalNotes: data.clinicalNotes || '',
        patientResponses: [],
        aiSummary: ''
    };

    setSessions(prev => [...prev, newSession]);
    setIsNewApptOpen(false);
    if(activeNav !== 'schedule') setActiveNav('schedule');
  };

  const generateGlobalInsight = async () => {
      setGlobalInsight("Synthesizing clinical trends...");
      const insight = await analyzeTrends(sessions);
      setGlobalInsight(insight);
  }

  const handleNavChange = (nav: string) => setActiveNav(nav);
  
  const handleViewHistory = (patient: Patient) => {
      setViewingPatient(patient);
      setIsHistoryOpen(true);
  };

  const renderDashboard = () => (
      <div className="animate-calm">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard title="Total Care" value={stats.totalSessions} icon={<Activity size={22} />} color="from-brand-blue/5 to-brand-blue/10" border="border-brand-blue/10" />
            <StatCard title="Recovery Index" value={`${stats.completionRate}%`} icon={<Activity size={22} />} color="from-brand-blue/5 to-brand-blue/10" border="border-brand-blue/10" />
            <StatCard title="Presence" value={`${stats.averageDuration}m`} icon={<Activity size={22} />} color="from-brand-blue/5 to-brand-blue/10" border="border-brand-blue/10" />
            <StatCard title="Scheduled" value={stats.upcomingCount} icon={<Calendar size={22} />} color="from-brand-blue/5 to-brand-blue/10" border="border-brand-blue/10" />
        </div>

        {/* AI Zen Card */}
        <div className="mb-10 calm-card p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden bg-white/60">
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/5 blur-[120px] pointer-events-none"></div>
            <div className="p-5 bg-brand-blue/10 rounded-3xl border border-brand-blue/10 shadow-inner">
                <Sparkles className="text-brand-blue" size={36}/>
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="serif-heading text-3xl font-bold mb-3 text-brand-navy">Clinical Clarity</h3>
                <p className="text-slate-500 text-base leading-relaxed max-w-2xl font-medium">
                    {globalInsight || "Your clinical assistant has distilled the recent sessions. Ready to explore the patterns?"}
                </p>
            </div>
            <button 
                onClick={generateGlobalInsight}
                className="btn-brand px-10 py-4 text-sm no-print shrink-0"
            >
                {globalInsight ? 'Refresh Analysis' : 'Run Insight Engine'}
            </button>
        </div>

        <div className="mb-12">
            <h2 className="serif-heading text-3xl font-bold text-brand-navy mb-8">Growth Metrics</h2>
            <AnalyticsView sessions={sessions} />
        </div>
        
        <div className="mb-12">
            <h2 className="serif-heading text-3xl font-bold text-brand-navy mb-8">Recent Connections</h2>
            <SessionList 
                sessions={sessions.slice(0, 5)} 
                onSelectSession={handleSessionSelect} 
                onStatusUpdate={handleStatusUpdate}
                onReschedule={handleRescheduleClick}
            />
        </div>
      </div>
  );

  const renderSchedule = () => {
      const scheduledSessions = sessions.filter(s => s.status === SessionStatus.SCHEDULED || s.status === SessionStatus.ONGOING);
      return (
          <div className="animate-calm">
             <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                     <h2 className="serif-heading text-4xl font-bold text-brand-navy mb-3 tracking-tight">Today's Flow</h2>
                     <p className="text-slate-500 font-medium text-lg">{scheduledSessions.length} sessions awaiting your presence.</p>
                </div>
                <button 
                    onClick={() => setIsNewApptOpen(true)}
                    className="btn-brand px-10 py-4 text-sm flex items-center gap-2 no-print"
                >
                    + New Engagement
                </button>
             </div>
             <SessionList 
                sessions={scheduledSessions} 
                onSelectSession={handleSessionSelect} 
                onStatusUpdate={handleStatusUpdate}
                title="Daily Schedule"
                onReschedule={handleRescheduleClick}
             />
          </div>
      )
  };

  const renderPatients = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-calm">
          {uniquePatients.map(patient => (
              <div key={patient.id} className="calm-card p-10 border border-slate-100 group relative overflow-hidden bg-white/80">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-blue/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col items-center text-center mb-8">
                      <div className="relative mb-6">
                        <div className="absolute -inset-2 bg-gradient-to-tr from-brand-blue to-blue-400 rounded-full opacity-10 group-hover:opacity-30 transition-opacity"></div>
                        <img src={patient.avatarUrl} alt="" className="relative w-24 h-24 rounded-full border-2 border-white object-cover shadow-2xl" />
                      </div>
                      <h3 className="serif-heading text-2xl font-bold text-brand-navy mb-2">{patient.name}</h3>
                      <div className="bg-blue-50 px-4 py-1 rounded-full border border-blue-100">
                        <p className="text-brand-blue text-xs font-bold tracking-widest uppercase">{patient.condition}</p>
                      </div>
                  </div>
                  <div className="space-y-4 text-sm text-slate-500 mb-10 pt-6 border-t border-slate-50 font-medium">
                      <p className="flex justify-between"><span>Age</span> <span className="text-brand-navy font-bold">{patient.age}</span></p>
                      <p className="flex justify-between"><span>Email</span> <span className="text-brand-navy truncate ml-4">{patient.email}</span></p>
                  </div>
                  <button 
                    onClick={() => handleViewHistory(patient)}
                    className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-full font-bold transition-all border border-slate-100 text-sm uppercase tracking-widest"
                  >
                    Medical Records
                  </button>
              </div>
          ))}
      </div>
  );

  return (
    <div className="flex h-screen font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex w-24 lg:w-80 bg-white/40 backdrop-blur-3xl border-r border-white/50 text-brand-navy flex-shrink-0 flex-col no-print z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="h-28 flex items-center justify-center lg:justify-start lg:px-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-blue rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-brand-blue/20">M</div>
            <span className="serif-heading font-bold text-3xl hidden lg:block tracking-tight text-brand-navy">Manas<span className="text-brand-blue italic">360</span></span>
          </div>
        </div>

        <nav className="flex-1 py-12 px-6 lg:px-10 space-y-6">
          <NavItem icon={<LayoutDashboard size={24}/>} label="Sanctuary" active={activeNav === 'dashboard'} onClick={() => handleNavChange('dashboard')} />
          <NavItem icon={<Calendar size={24}/>} label="Daily Flow" active={activeNav === 'schedule'} onClick={() => handleNavChange('schedule')} />
          <NavItem icon={<Users size={24}/>} label="Patient Circle" active={activeNav === 'patients'} onClick={() => handleNavChange('patients')} />
          <NavItem icon={<Activity size={24}/>} label="Zen Metrics" active={activeNav === 'analytics'} onClick={() => handleNavChange('analytics')} />
        </nav>

        <div className="p-10 border-t border-slate-100">
            <button className="flex items-center justify-center lg:justify-start gap-5 text-slate-400 hover:text-brand-navy transition-all w-full py-3 group">
                <Settings size={22} className="group-hover:rotate-45 transition-transform" />
                <span className="hidden lg:block font-bold text-sm tracking-wide">Configuration</span>
            </button>
        </div>
      </aside>

      {/* Main Sanctuary */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-28 bg-transparent flex items-center justify-between px-12 no-print z-10 shrink-0">
          <h1 className="serif-heading text-3xl font-bold text-brand-navy tracking-tight">
            {activeNav === 'dashboard' ? 'Practice Overview' : activeNav.charAt(0).toUpperCase() + activeNav.slice(1)}
          </h1>
          <div className="flex items-center gap-8">
            <div className="relative group no-print hidden lg:block">
                <input type="text" placeholder="Search care records..." className="pl-12 pr-6 py-3 bg-white/60 border border-white/80 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-blue/10 text-sm text-brand-navy w-64 transition-all shadow-sm focus:shadow-md" />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="flex items-center gap-5 bg-white/60 pl-5 pr-1 py-1 rounded-full border border-white shadow-sm">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-brand-navy">Dr. Carter</p>
                <p className="text-[10px] text-brand-blue font-bold uppercase tracking-[0.2em]">Therapist</p>
              </div>
              <img src="https://picsum.photos/48/48?grayscale" alt="Profile" className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-sm" />
            </div>
          </div>
        </header>

        <div id="printable-area" className="flex-1 overflow-auto px-8 md:px-12 pb-16 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                {activeNav === 'dashboard' && renderDashboard()}
                {activeNav === 'schedule' && renderSchedule()}
                {activeNav === 'patients' && renderPatients()}
                {activeNav === 'analytics' && (
                    <div className="animate-calm">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                            <div>
                                <h2 className="serif-heading text-4xl font-bold text-brand-navy mb-2">Clinical Insights</h2>
                                <p className="text-slate-500 font-medium">Holistic view of your practice performance.</p>
                            </div>
                            <div className="flex gap-4 no-print">
                                <button 
                                    onClick={() => window.print()}
                                    className="px-8 py-3.5 bg-slate-900 text-white rounded-full text-sm font-bold flex items-center gap-3 shadow-xl transition-transform active:scale-95"
                                >
                                    <Printer size={18} /> Print Analysis
                                </button>
                                <button 
                                    className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-bold flex items-center gap-3 transition-all hover:bg-slate-50"
                                >
                                    <FileDown size={18} /> Export Data
                                </button>
                            </div>
                        </div>
                        <AnalyticsView sessions={sessions} />
                    </div>
                )}
            </div>
        </div>
      </main>

      <SessionDetailModal session={selectedSession} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpdateStatus={handleStatusUpdate} />
      <PatientHistoryModal patient={viewingPatient} sessions={sessions} isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} onSelectSession={handleSessionSelect} onStatusUpdate={handleStatusUpdate} />
      <NewAppointmentModal isOpen={isNewApptOpen} onClose={() => setIsNewApptOpen(false)} onSave={handleCreateAppointment} patients={uniquePatients} />
      <RescheduleModal session={reschedulingSession} isOpen={!!reschedulingSession} onClose={() => setReschedulingSession(null)} onSave={handleRescheduleSave} />
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-4 rounded-3xl transition-all duration-500 group relative ${active ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'text-slate-400 hover:text-brand-navy hover:bg-white/60'}`}
  >
    <span className={`${active ? 'text-white' : 'group-hover:text-brand-blue'} transition-colors`}>{icon}</span>
    <span className="hidden lg:block font-bold text-sm tracking-wide">{label}</span>
  </button>
);

const StatCard = ({ title, value, icon, color, border }: { title: string, value: string | number, icon: React.ReactNode, color: string, border: string }) => (
  <div className={`calm-card p-8 transition-all duration-700 hover:scale-[1.03] flex flex-col justify-between h-40 bg-gradient-to-br ${color} ${border}`}>
    <div className="flex justify-between items-start">
      <span className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">{title}</span>
      <div className="text-brand-blue p-2 bg-white rounded-xl border border-slate-100 shadow-sm">{icon}</div>
    </div>
    <div className="text-4xl font-bold text-brand-navy tracking-tight serif-heading">{value}</div>
  </div>
);

export default App;