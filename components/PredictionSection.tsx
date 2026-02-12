import React from 'react';
import { BrainCircuit, TrendingUp, AlertTriangle, CalendarClock, RefreshCw, ShieldCheck, Info } from 'lucide-react';

interface Props {
  prediction: string | null;
  isLoading: boolean;
  onRunPrediction: () => void;
  onReset: () => void;
  canPredict: boolean;
}

export const PredictionSection: React.FC<Props> = ({ 
  prediction, 
  isLoading, 
  onRunPrediction, 
  onReset,
  canPredict 
}) => {
  const renderPredictionContent = () => {
    if (!prediction) return null;

    return prediction.split('\n').map((line, i) => {
      const cleanLine = line.replace(/\*\*/g, '').trim(); 
      if (!cleanLine) return null;

      const isPrognosis = cleanLine.includes('Prognosis');
      const isRisk = cleanLine.includes('Risk');
      const isIntervention = cleanLine.includes('Intervention');
      const isConfidence = cleanLine.includes('Confidence Score');
      const isHeader = isPrognosis || isRisk || isIntervention || isConfidence;
      
      if (isHeader && cleanLine.includes(':')) {
          const [label, ...contentParts] = cleanLine.split(':');
          const content = contentParts.join(':').trim();

          let icon = <CalendarClock size={16} className="text-brand-blue"/>;
          let colorClass = "text-brand-blue";
          let bgClass = "bg-blue-50";
          let borderClass = "border-blue-100";
          
          if (isRisk) {
              icon = <AlertTriangle size={16} className="text-orange-600"/>;
              colorClass = "text-orange-700";
              bgClass = "bg-orange-50";
              borderClass = "border-orange-100";
          } else if (isIntervention) {
              icon = <TrendingUp size={16} className="text-emerald-600"/>;
              colorClass = "text-emerald-700";
              bgClass = "bg-emerald-50";
              borderClass = "border-emerald-100";
          } else if (isConfidence) {
              icon = <ShieldCheck size={16} className="text-slate-600"/>;
              colorClass = "text-slate-700";
              bgClass = "bg-slate-50";
              borderClass = "border-slate-100";
          }

          return (
              <div key={i} className={`mb-3 p-4 rounded-2xl ${bgClass} border ${borderClass} shadow-sm`}>
                  <p className={`font-bold ${colorClass} text-[10px] uppercase tracking-wider mb-2 flex items-center gap-2`}>
                      {icon} {label.trim()}
                  </p>
                  <p className="text-sm text-brand-navy leading-relaxed font-medium">
                      {content}
                  </p>
              </div>
          );
      }
      
      return <p key={i} className="mb-1 text-slate-500 text-xs pl-1">{cleanLine}</p>;
    });
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden border border-slate-100 flex flex-col min-h-[350px]">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <BrainCircuit size={180} className="text-brand-blue" />
        </div>

        <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
                <h3 className="serif-heading text-2xl font-bold flex items-center gap-2 text-brand-navy">
                    <BrainCircuit size={24} className="text-brand-blue" /> 
                    AI Prognosis
                </h3>
                <p className="text-slate-400 text-xs mt-1 font-medium">
                    Predictive medical modelling.
                </p>
            </div>
            {prediction && (
                 <button onClick={onReset} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-brand-navy">
                    <RefreshCw size={16} />
                 </button>
            )}
        </div>
        
        <div className="flex-1 relative z-10 flex flex-col">
            {!prediction ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-2">
                        <BrainCircuit size={40} className="text-slate-300" />
                    </div>
                    {canPredict ? (
                        <>
                             <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">
                                Analyze clinical markers to forecast the recovery trajectory for this patient.
                            </p>
                            <button 
                                onClick={onRunPrediction}
                                disabled={isLoading}
                                className="btn-brand px-10 py-3.5 text-sm"
                            >
                                {isLoading ? 'Analyzing...' : 'Predict Outcome'}
                            </button>
                        </>
                    ) : (
                        <p className="text-sm text-slate-400 italic bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
                            More data required for analysis.
                        </p>
                    )}
                </div>
            ) : (
                <div className="flex flex-col h-full">
                    <div className="animate-calm custom-scrollbar overflow-y-auto max-h-[400px] pr-2 space-y-1 flex-1">
                        {renderPredictionContent()}
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-start gap-2 text-[10px] text-slate-400 italic">
                        <Info size={14} className="flex-shrink-0" />
                        <p>Experimental prognosis support tool.</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};