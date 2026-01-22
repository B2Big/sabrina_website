'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Clock, Zap, Trophy, RotateCcw } from 'lucide-react';

type CalculationMode = 'vma' | 'time';

export function PaceCalculator() {
  const [mode, setMode] = useState<CalculationMode>('vma');
  const [vma, setVma] = useState<string>('');
  const [timeDigits, setTimeDigits] = useState<string>(''); 
  const [result, setResult] = useState<{
    ef: string[]; // [low, high]
    marathon: string;
    threshold: string[]; // [low, high]
    vma: string;
  } | null>(null);

  // Parse time digits to seconds (Strict HH MM SS)
  const parseTimeToSeconds = (digits: string): number => {
    const padded = digits.padEnd(6, '0');
    const h = parseInt(padded.substring(0, 2)) || 0;
    const m = parseInt(padded.substring(2, 4)) || 0;
    const s = parseInt(padded.substring(4, 6)) || 0;
    return h * 3600 + m * 60 + s;
  };

  const handleVmaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 3) raw = raw.slice(0, 3);
    
    // Auto-indent decimal: 125 -> 12.5
    if (raw.length > 2) {
        setVma(raw.slice(0, 2) + '.' + raw.slice(2));
    } else {
        setVma(raw);
    }
  };

  const timeDisplay = useMemo(() => {
    if (mode !== 'time') return { typed: '', ghost: '' };
    const raw = timeDigits;
    const padded = raw.padEnd(6, '0');
    
    let finalTyped = "";
    if (raw.length >= 2) finalTyped += raw.substring(0, 2) + "h";
    else finalTyped += raw.substring(0, 2);

    if (raw.length > 2) {
        if (raw.length >= 4) finalTyped += " " + raw.substring(2, 4) + "m";
        else finalTyped += " " + raw.substring(2, 4);
    }

    if (raw.length > 4) {
        finalTyped += " " + raw.substring(4, 6) + "s";
    }

    const fullTemplate = "00h 00m 00s";
    const finalGhost = fullTemplate.substring(finalTyped.length);

    return { typed: finalTyped, ghost: finalGhost };
  }, [timeDigits, mode]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
    setTimeDigits(raw);
  };

  const handleReset = () => {
    setVma('');
    setTimeDigits('');
    setResult(null);
  };

  const formatPace = (speedKmH: number) => {
    if (!speedKmH || speedKmH === 0) return "-";
    const paceMinPerKm = 60 / speedKmH;
    const min = Math.floor(paceMinPerKm);
    const sec = Math.round((paceMinPerKm - min) * 60);
    if (sec === 60) return `${min + 1}'00"`;
    return `${min}'${sec < 10 ? '0' : ''}${sec}"`;
  };

  const handleCalculate = () => {
    let calculatedVma = 0;
    if (mode === 'vma') {
      calculatedVma = parseFloat(vma);
    } else {
      const totalSeconds = parseTimeToSeconds(timeDigits);
      if (totalSeconds > 0) {
        const speedKmH = (10 / totalSeconds) * 3600;
        calculatedVma = speedKmH / 0.9;
      }
    }

    if (!calculatedVma || isNaN(calculatedVma)) return;

    const vmaNum = calculatedVma;
    setResult({
      ef: [formatPace(vmaNum * 0.65), formatPace(vmaNum * 0.75)],
      marathon: formatPace(vmaNum * 0.80),
      threshold: [formatPace(vmaNum * 0.85), formatPace(vmaNum * 0.90)],
      vma: vmaNum.toFixed(1)
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
      <div className="bg-[#3B82F6] p-8 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Activity size={120} />
        </div>
        <h3 className="text-3xl font-black flex items-center justify-center gap-3 relative z-10">
          <Activity className="w-8 h-8" />
          Club Run
        </h3>
        <p className="text-blue-100 mt-2 font-medium relative z-10">Calculateur d&apos;allures expert</p>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => { setMode('vma'); handleReset(); }}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
              mode === 'vma' ? 'bg-white text-[#3B82F6] shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Ma VMA
          </button>
          <button
            onClick={() => { setMode('time'); handleReset(); }}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              mode === 'time' ? 'bg-white text-[#3B82F6] shadow-md' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Mon Temps 10km
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                {mode === 'vma' ? 'Vitesse Maximale Aérobie' : 'Performance sur 10 000m'}
            </label>
          </div>

          <div className="relative group">
            <div className="flex flex-col gap-4">
              <div className="relative flex-1">
                {mode === 'time' && (
                  <div className="absolute inset-0 px-5 py-4 flex items-center font-mono text-xl pointer-events-none select-none">
                    <span className="text-slate-900">{timeDisplay.typed}</span>
                    <span className="text-slate-400">{timeDisplay.ghost}</span>
                  </div>
                )}

                <input
                  type={mode === 'vma' ? "tel" : "tel"}
                  inputMode={mode === 'vma' ? "decimal" : "numeric"}
                  value={mode === 'vma' ? vma : timeDisplay.typed}
                  onChange={mode === 'vma' ? handleVmaChange : handleTimeChange}
                  placeholder={mode === 'vma' ? "Ex: 15.5" : ""}
                  className={`w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#3B82F6] outline-none text-xl transition-all font-mono ${
                    mode === 'time' ? 'text-transparent caret-slate-900' : 'text-slate-900'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
                />
                
                {mode === 'vma' && (
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm pointer-events-none">
                    km/h
                  </span>
                )}
                
                {mode === 'time' && !timeDigits && (
                   <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xl pointer-events-none">
                     00h 00m 00s
                   </span>
                )}
              </div>

              <div className="flex gap-3">
                <Button 
                    onClick={handleCalculate}
                    className="flex-1 py-6 text-lg font-black bg-[#3B82F6] hover:bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                    Calculer
                </Button>
                
                {(vma || timeDigits || result) && (
                    <Button 
                        onClick={handleReset}
                        variant="outline"
                        className="py-6 px-6 border-2 border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 rounded-2xl transition-all group"
                        title="Réinitialiser"
                    >
                        <RotateCcw className="w-6 h-6 group-hover:rotate-[-45deg] transition-transform" />
                        <span className="ml-2 font-bold sm:inline hidden">Reset</span>
                    </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">VMA Estimée</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-4xl font-black text-slate-900 leading-none">{result.vma}</p>
                    <span className="text-sm font-bold text-slate-400">km/h</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#3B82F6]">
                <Activity size={28} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResultCard icon={<Clock size={20} />} label="Endurance" sub="65-75% VMA" values={result.ef} color="blue" />
              <ResultCard icon={<Trophy size={20} />} label="Marathon" sub="80% VMA" values={[result.marathon]} color="indigo" />
              <ResultCard icon={<Zap size={20} />} label="Seuil" sub="85-90% VMA" values={result.threshold} color="cyan" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultCard({ icon, label, sub, values, color }: { 
    icon: React.ReactNode, label: string, sub: string, values: string[], color: 'blue' | 'indigo' | 'cyan' 
}) {
    const colors = {
        blue: "text-blue-600 bg-blue-50/50 border-blue-100",
        indigo: "text-indigo-600 bg-indigo-50/50 border-indigo-100",
        cyan: "text-cyan-600 bg-cyan-50/50 border-cyan-100"
    };
    return (
        <div className={`p-5 rounded-[2rem] border transition-all hover:scale-[1.02] bg-white ${colors[color].split(' ').slice(2).join(' ')}`}>
            <div className={`flex items-center gap-2 mb-4 font-black text-xs uppercase tracking-widest ${colors[color].split(' ')[0]}`}>
                {icon} {label}
            </div>
            <div className="space-y-1">
                {values.map((v, i) => (
                    <div key={i} className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-800">{v}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">/km</span>
                        {i === 0 && values.length > 1 && <span className="text-[10px] font-bold text-slate-300 ml-1">à</span>}
                    </div>
                ))}
            </div>
            <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-tighter">{sub}</p>
        </div>
    );
}
