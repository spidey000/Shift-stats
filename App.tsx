
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Calculator, 
  TrendingUp, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Award,
  Clock,
  Coffee,
  Moon,
  Plane,
  Sparkles,
  Sunrise,
  Star,
  Users,
  ShieldCheck,
  AlertTriangle,
  Sigma
} from 'lucide-react';
import { RotationConfig } from './types';
import { ShiftRotationAnalyzer } from './logic';

// Reusable Tooltip Component using Portal
const Tooltip = ({ content }: { content: string }) => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const handleInteraction = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({ x: rect.left + rect.width / 2, y: rect.top });
  };

  return (
    <>
      <span
        className="inline-flex items-center ml-1.5 cursor-help align-text-bottom relative z-10"
        onMouseEnter={handleInteraction}
        onMouseLeave={() => setCoords(null)}
        onClick={(e) => {
          e.stopPropagation();
          // Toggle for mobile/touch
          if (coords) setCoords(null);
          else handleInteraction(e);
        }}
      >
        <Info className="w-3.5 h-3.5 text-slate-500 hover:text-indigo-400 transition-colors opacity-70 hover:opacity-100" />
      </span>
      {coords &&
        createPortal(
          <div
            className="fixed z-[9999] w-64 p-3 bg-slate-900/95 backdrop-blur-md text-xs font-medium text-slate-200 rounded-xl border border-slate-700 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] text-center pointer-events-none animate-in fade-in zoom-in-95 duration-150 leading-relaxed"
            style={{
              top: coords.y - 8,
              left: coords.x,
              transform: 'translate(-50%, -100%)',
            }}
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95"></div>
          </div>,
          document.body
        )}
    </>
  );
};

const MathExplanation = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
             <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50 transition-all group"
             >
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                        <Sigma className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                        <span className="block font-bold text-sm uppercase tracking-wider">Metodología de Cálculo</span>
                        <span className="text-xs text-slate-500 font-normal">Desglose de fórmulas matemáticas utilizadas</span>
                    </div>
                </div>
                {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
             </button>
             
             {isOpen && (
                <div className="px-6 pb-8 pt-2 animate-in slide-in-from-top-2 fade-in duration-300 border-t border-slate-800/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-[1300px]:grid-cols-4 gap-6 text-sm text-slate-400 mt-4">
                        
                        {/* Box 1 */}
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                1. La Demanda (Necesidad)
                            </h4>
                            <p className="mb-2 leading-relaxed text-xs">
                                El objetivo es cubrir 18 puestos diarios todo el año.
                            </p>
                            <ul className="space-y-1 font-mono text-xs bg-slate-900 p-2 rounded">
                                <li className="flex justify-between">
                                    <span>Puestos Día:</span> <span className="text-white">12</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Puestos Noche:</span> <span className="text-white">4</span>
                                </li>
                                <li className="flex justify-between text-indigo-300">
                                    <span>Guardias:</span> <span className="text-white">2</span>
                                </li>
                                <li className="flex justify-between border-t border-slate-700 pt-1 mt-1">
                                    <span>Total Puestos:</span> <span className="text-white">18</span>
                                </li>
                            </ul>
                            <div className="mt-2 text-xs">
                                <span className="text-indigo-400 font-bold">Total Turnos Anuales:</span>
                                <br />
                                18 puestos × 365 días = <span className="text-white font-bold">6.570 turnos</span>.
                            </div>
                        </div>

                        {/* Box 2 */}
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                             <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-400" />
                                2. Capacidad Individual
                            </h4>
                            <p className="mb-2 leading-relaxed text-xs">
                                Cuántos turnos reales hace una persona al año, descontando vacaciones.
                            </p>
                            <div className="font-mono text-xs bg-slate-900 p-2 rounded space-y-2">
                                <div>
                                    <span className="text-slate-500 block">Ciclos Brutos al año:</span>
                                    365 días ÷ (Días Trabajo + Descanso)
                                </div>
                                <div>
                                    <span className="text-slate-500 block">Turnos Brutos:</span>
                                    Ciclos × Días de Trabajo
                                </div>
                                <div className="border-t border-slate-700 pt-1 text-emerald-400">
                                    <span className="text-slate-500 block">Turnos Efectivos (Netos):</span>
                                    Turnos Brutos - <span className="text-white font-bold">22 días (Vacaciones)</span>
                                </div>
                            </div>
                        </div>

                         {/* Box 3 */}
                         <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-400" />
                                3. El Factor Limitante
                            </h4>
                             <p className="mb-2 leading-relaxed text-xs">
                                Se calcula la necesidad y se añade un <span className="text-white font-bold">5% de backup</span> por bajas.
                            </p>
                            <div className="space-y-3 mt-3">
                                <div className="bg-slate-900 p-2 rounded border-l-2 border-blue-500">
                                    <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">Cálculo A: Por Volumen</span>
                                    <span className="font-mono text-xs">(6.570 ÷ Turnos Efec.) × 1.05</span>
                                </div>
                                <div className="bg-slate-900 p-2 rounded border-l-2 border-violet-500">
                                    <span className="text-[10px] uppercase font-bold text-violet-400 block mb-1">Cálculo B: Por Noches</span>
                                    <span className="font-mono text-xs">(1.460 ÷ Noches Efec.) × 1.05</span>
                                </div>
                            </div>
                        </div>

                        {/* Box 4 */}
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <Calculator className="w-4 h-4 text-indigo-400" />
                                4. Resultado Final
                            </h4>
                            <p className="mb-3 leading-relaxed text-xs">
                                El sistema elige automáticamente el <span className="text-white font-bold">MAYOR</span> de los dos cálculos anteriores.
                            </p>
                            <div className="text-xs bg-indigo-500/10 p-3 rounded border border-indigo-500/20">
                                Ejemplo: Si A=25 y B=30
                                <br/><br/>
                                <span className="text-white font-bold text-sm">Plantilla Min = 30</span>
                                <br/>
                                <span className="text-indigo-300 italic">(Exceso de personal de día inevitable para cubrir la noche + margen seguridad).</span>
                            </div>
                        </div>

                    </div>
                </div>
             )}
        </div>
    );
};

const App: React.FC = () => {
  // Use current year and Jan 1st as fixed defaults
  const year = new Date().getFullYear();
  const startDate = `${year}-01-01`;

  const [rotations, setRotations] = useState<RotationConfig[]>([
    { id: '1', workDays: 6, restDays: 3, nights: 2 },
    { id: '2', workDays: 5, restDays: 3, nights: 2 },
    { id: '3', workDays: 6, restDays: 4, nights: 2 },
  ]);

  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  const validRotations = useMemo(() => {
    return rotations.filter(r => !isNaN(r.workDays) && !isNaN(r.restDays) && r.workDays >= 0 && r.restDays >= 0);
  }, [rotations]);

  const results = useMemo(() => {
    const analyzer = new ShiftRotationAnalyzer(year, new Date(startDate));
    return validRotations.map(r => analyzer.analyzeRotation(r));
  }, [year, startDate, validRotations]);

  const bestRotation = useMemo(() => {
    if (results.length === 0) return null;
    return results.reduce((prev, current) => 
      (prev.weekendStats.fullWeekends > current.weekendStats.fullWeekends) ? prev : current
    );
  }, [results]);

  const addRotation = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    // Default to a standard 5 work, 3 rest (2 clean) rotation, name is now dynamic
    setRotations([...rotations, { id: newId, workDays: 5, restDays: 3, nights: 0 }]);
  };

  const removeRotation = (id: string) => {
    setRotations(rotations.filter(r => r.id !== id));
  };

  const updateRotation = (id: string, field: keyof RotationConfig, value: string) => {
    setRotations(rotations.map(r => {
      if (r.id === id) {
        const numVal = value === "" ? NaN : parseInt(value, 10);
        return { ...r, [field]: numVal };
      }
      return r;
    }));
  };

  // Helper function to calculate and render difference against baseline (first element)
  const getDifference = (current: number, baseline: number, lowerIsBetter: boolean = false) => {
    const diff = current - baseline;
    if (diff === 0) return null;
    
    // Logic: 
    // If lowerIsBetter (e.g. work days, nights, headcount): positive diff is BAD (red), negative diff is GOOD (green)
    // If higherIsBetter (e.g. weekends): positive diff is GOOD (green), negative diff is BAD (red)
    
    const isPositive = diff > 0;
    const isGood = lowerIsBetter ? !isPositive : isPositive;
    
    return (
      <span className={`ml-1.5 text-[10px] font-black ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
        {diff > 0 ? '+' : ''}{diff}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-40 md:pb-24 selection:bg-indigo-500/30">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Shift <span className="text-indigo-400">Stats</span></h1>
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Período</span>
            <span className="text-sm font-medium text-slate-300">{year}</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Panel de Configuración */}
        <section className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex flex-col min-[1300px]:flex-row gap-8">
            <div className="min-[1300px]:w-1/3 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Configuración General</h2>
              </div>
              
               {/* Cobertura Requerida Info Box */}
               <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 mt-4">
                 <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Objetivo de Cobertura</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <div className="text-sm text-slate-400">
                      Cubrir <span className="text-white font-bold">18 puestos</span> diarios:
                      <br/>
                      <span className="text-xs text-slate-500">12 Día + 4 Noche + 2 Guardia</span>
                      <br/>
                      <span className="text-[10px] text-indigo-400 italic mt-1 block">+5% Margen (Bajas/Contingencia)</span>
                    </div>
                    <div className="text-right">
                       <span className="block text-xs text-slate-500 mb-0.5">Vacaciones</span>
                       <span className="font-bold text-white text-sm">22 días laborables</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="min-[1300px]:w-2/3 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">Patrones de Rotación</h2>
                </div>
                <button 
                  onClick={addRotation}
                  className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Añadir Comparativa
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 min-[1300px]:grid-cols-4 gap-4">
                {rotations.map((rotation, index) => {
                  const isWorkValid = !isNaN(rotation.workDays) && rotation.workDays > 0;
                  const isRestValid = !isNaN(rotation.restDays) && rotation.restDays >= 0;
                  const isNightsValid = !isNaN(rotation.nights) && rotation.nights >= 0 && rotation.nights <= rotation.workDays;

                  // Generate dynamic name for the header
                  const w = rotation.workDays || 0;
                  const n = rotation.nights || 0;
                  const r = rotation.restDays || 0;
                  const dynamicHeader = index === 0
                    ? `${w} Trabajo - ${n} Noches - ${r} Libres`
                    : `${w}T - ${n}N - ${r}L`;

                  return (
                    <div key={rotation.id} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 relative group">
                      {/* Header Row: Dynamic Name + Delete */}
                      <div className="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-2">
                         <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white font-mono">
                                {dynamicHeader}
                            </span>
                             {index === 0 && (
                                <span className="text-[9px] uppercase font-bold text-slate-300 bg-slate-700 px-1.5 py-0.5 rounded border border-slate-600">Ref</span>
                             )}
                         </div>
                         <button 
                            onClick={() => removeRotation(rotation.id)}
                            disabled={rotations.length <= 1}
                            className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                            title="Eliminar rotación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                      </div>

                      {/* Inputs Row */}
                      <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1 tracking-wider truncate text-center">
                              Trabajo
                            </label>
                            <input 
                              type="number"
                              value={isNaN(rotation.workDays) ? "" : rotation.workDays}
                              onChange={(e) => updateRotation(rotation.id, 'workDays', e.target.value)}
                              className={`w-full px-2 py-1.5 rounded-lg bg-slate-800 border text-white text-sm outline-none text-center transition-all ${isWorkValid ? 'border-slate-700 focus:ring-indigo-500' : 'border-red-500/50 bg-red-500/5 focus:ring-red-500'}`}
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1 tracking-wider truncate text-center">
                              Noches
                            </label>
                            <input 
                              type="number"
                              value={isNaN(rotation.nights) ? "" : rotation.nights}
                              onChange={(e) => updateRotation(rotation.id, 'nights', e.target.value)}
                              className={`w-full px-2 py-1.5 rounded-lg bg-slate-800 border text-white text-sm outline-none text-center transition-all ${isNightsValid ? 'border-slate-700 focus:ring-indigo-500' : 'border-red-500/50 bg-red-500/5 focus:ring-red-500'}`}
                            />
                          </div>

                          <div className="flex-1">
                            <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1 tracking-wider truncate text-center">
                              Descanso
                            </label>
                            <input 
                              type="number"
                              value={isNaN(rotation.restDays) ? "" : rotation.restDays}
                              onChange={(e) => updateRotation(rotation.id, 'restDays', e.target.value)}
                              className={`w-full px-2 py-1.5 rounded-lg bg-slate-800 border text-white text-sm outline-none text-center transition-all ${isRestValid ? 'border-slate-700 focus:ring-indigo-500' : 'border-red-500/50 bg-red-500/5 focus:ring-red-500'}`}
                            />
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {results.length > 0 ? (
          <>
            {/* Tarjetas de Resumen y Recomendación */}
            <div className="grid grid-cols-1 min-[1300px]:grid-cols-3 gap-6">
              {bestRotation && (
                <div className="min-[1300px]:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-8 h-8 text-yellow-400" />
                      <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Mejor Opción</span>
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{bestRotation.rotationName}</h3>
                    <p className="text-indigo-100 max-w-md text-lg leading-relaxed mb-6">
                      Maximiza tu tiempo libre con <span className="font-bold text-white">{bestRotation.weekendStats.fullWeekends} fines de semana</span> libres al año.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center">
                        <span className="block text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                          Trabajo <Tooltip content="Días totales trabajados al año." />
                        </span>
                        <span className="text-2xl font-black">{bestRotation.workDays}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center">
                        <span className="block text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                          Noches <Tooltip content="Total noches trabajadas al año." />
                        </span>
                        <span className="text-2xl font-black">{bestRotation.totalNights}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center">
                        <span className="block text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                          Libre <Tooltip content="Días de descanso completo (24h)." />
                        </span>
                        <span className="text-2xl font-black">{bestRotation.libreDays}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center">
                        <span className="block text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                          L+L Full <Tooltip content="Fines de semana 'Limpios' (Sábado + Domingo libres)." />
                        </span>
                        <span className="text-2xl font-black">{bestRotation.weekendStats.cleanWeekends}</span>
                      </div>
                    </div>
                  </div>
                  <Award className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                </div>
              )}

              <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Eficiencia</h4>
                    <p className="text-lg font-bold text-white">Findes Libres <Tooltip content="Número de fines de semana completos (L+L o S+L) respecto al total anual (52)." /></p>
                  </div>
                </div>

                {/* Visible Legend for Efficiency */}
                <div className="mb-5 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 space-y-2">
                   <div className="flex justify-between items-center text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Libre + Libre (Completo)
                      </span>
                      <span className="text-slate-400">Sábado y Domingo Libres</span>
                   </div>
                   <div className="flex justify-between items-center text-xs border-t border-slate-700/50 pt-2">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Sunrise className="w-3 h-3" /> Saliente + Libre (Parcial)
                      </span>
                      <span className="text-slate-400">Sáb. Saliente + Dom. Libre</span>
                   </div>
                </div>

                <div className="space-y-6">
                  {results.map(r => (
                    <div key={r.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-slate-300">{r.rotationName}</span>
                        <span className="font-bold text-indigo-400">{r.weekendStats.fullWeekends} / 52</span>
                      </div>
                      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex shadow-inner">
                        <div 
                          className="bg-indigo-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                          style={{ width: `${(r.weekendStats.fullWeekends / 52) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Gráfico de barras ajustado para modo oscuro */}
            <section className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8">
              <div className="flex items-center gap-2 mb-8">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Comparativa Visual</h2>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={results} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis 
                      dataKey="rotationName" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                    />
                    <RechartsTooltip 
                      cursor={{ fill: '#1e293b' }} 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderRadius: '12px', 
                        border: '1px solid #334155', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                        color: '#f8fafc'
                      }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle"/>
                    <Bar name="Findes Libres" dataKey="weekendStats.fullWeekends" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar name="Días Libres" dataKey="libreDays" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar name="Noches Totales" dataKey="totalNights" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Resumen de Días Anuales (Grid Card View) */}
            <section className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
              <div className="px-6 sm:px-8 py-6 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Resumen de Días Anuales</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">Año {year}</span>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 min-[1300px]:grid-cols-3 gap-6">
                {results.map((r, index) => {
                   const baseline = results[0];
                   const isBaseline = index === 0;
                   const isActive = activeDetailId === r.id;
                   const limitingIsNights = r.staffing.limitingFactor === 'nights';
                   const isImpossible = r.staffing.limitingFactor === 'impossible';

                   return (
                      <div key={r.id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden hover:border-indigo-500/30 transition-all">
                        {/* Card Header */}
                        <div className="p-4 border-b border-slate-700/50 flex justify-between items-start">
                           <div>
                              <div className="flex items-center gap-2">
                                 <span className="font-bold text-white text-lg">{r.rotationName}</span>
                                 {isBaseline && <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded uppercase tracking-wider">Base</span>}
                              </div>
                              <div className="text-xs text-slate-500 font-mono mt-1">{r.pattern}</div>
                              <div className="flex items-center gap-2 mt-2">
                                 <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${isImpossible ? 'text-slate-300 bg-slate-700' : 'text-blue-400 bg-blue-400/10'}`}>
                                    {isImpossible ? <AlertTriangle className="w-3 h-3 text-amber-500"/> : <Users className="w-3 h-3" />}
                                    {isImpossible ? 'N/A' : `${r.staffing.requiredHeadcount} personas`}
                                 </span>
                                 {limitingIsNights && <span className="text-[9px] text-violet-400 font-medium bg-violet-400/10 px-1.5 py-0.5 rounded border border-violet-400/20">Limitado por Noches</span>}
                                 {isImpossible && <span className="text-[9px] text-amber-500 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Imposible (0 Noches)</span>}
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Findes</div>
                              <div className="text-xl font-black text-white flex items-center justify-end">
                                 {r.weekendStats.fullWeekends}
                                 {!isBaseline && getDifference(r.weekendStats.fullWeekends, baseline.weekendStats.fullWeekends)}
                              </div>
                           </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 divide-x divide-slate-700/50 border-b border-slate-700/50">
                           <div className="p-3 text-center">
                              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Clock className="w-3 h-3" /> Trabajo</span>
                              <span className="text-sm font-bold text-red-400">
                                 {r.workDays}
                              </span>
                              {!isBaseline && <div className="flex justify-center">{getDifference(r.workDays, baseline.workDays, true)}</div>}
                           </div>
                           <div className="p-3 text-center">
                              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Star className="w-3 h-3" /> Noches</span>
                              <span className="text-sm font-bold text-violet-400">
                                 {r.totalNights}
                              </span>
                              {!isBaseline && <div className="flex justify-center">{getDifference(r.totalNights, baseline.totalNights, true)}</div>}
                           </div>
                           <div className="p-3 text-center">
                              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Moon className="w-3 h-3" /> Saliente</span>
                              <span className="text-sm font-bold text-amber-400">
                                 {r.salienteDays}
                              </span>
                              {!isBaseline && <div className="flex justify-center">{getDifference(r.salienteDays, baseline.salienteDays)}</div>}
                           </div>
                           <div className="p-3 text-center">
                              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Coffee className="w-3 h-3" /> Libre</span>
                              <span className="text-sm font-bold text-emerald-400">
                                 {r.libreDays}
                              </span>
                              {!isBaseline && <div className="flex justify-center">{getDifference(r.libreDays, baseline.libreDays)}</div>}
                           </div>
                        </div>

                         {/* Secondary Stats */}
                        <div className="grid grid-cols-2 divide-x divide-slate-700/50 border-b border-slate-700/50 bg-slate-900/20">
                            <div className="p-3 flex flex-col items-center justify-center">
                                 <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total Descanso</span>
                                 <span className="text-sm font-medium text-slate-300">
                                    {r.totalRestDays} d
                                    {!isBaseline && getDifference(r.totalRestDays, baseline.totalRestDays)}
                                 </span>
                            </div>
                            <div className="p-3 flex justify-center gap-3">
                               <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Sábado + Domingo</span>
                                  <div className="flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-emerald-400" />
                                      <span className="text-sm font-bold text-emerald-400">{r.weekendStats.cleanWeekends}</span>
                                  </div>
                               </div>
                               <div className="w-px bg-slate-700 h-8 self-center"></div>
                               <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">Saliente + Domingo</span>
                                  <div className="flex items-center gap-1">
                                      <Sunrise className="w-3 h-3 text-amber-400" />
                                      <span className="text-sm font-bold text-amber-400">{r.weekendStats.salienteWeekends}</span>
                                  </div>
                               </div>
                            </div>
                        </div>

                        {/* Toggle Button */}
                        <div className="p-2 bg-slate-800/80">
                           <button 
                             onClick={() => setActiveDetailId(activeDetailId === r.id ? null : r.id)}
                             className={`w-full text-sm font-bold flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all ${isActive ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-indigo-400 border-transparent hover:bg-slate-700/50'}`}
                           >
                             {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                             {isActive ? 'Ocultar Calendario' : 'Ver Calendario'}
                           </button>
                        </div>

                        {/* Details Panel */}
                        {isActive && (
                           <div className="p-4 border-t border-slate-700 bg-slate-950/30">
                              <div className="mb-4">
                                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Detalle de Fines de Semana</h3>
                                  <p className="text-[10px] text-slate-500">Calendario completo para <span className="text-indigo-400">{r.rotationName}</span></p>
                              </div>

                              {/* Legend */}
                              <div className="grid grid-cols-1 gap-2 mb-4 text-[10px] bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                   <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                      <span className="text-slate-300">Libre + Libre (Completo)</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                      <span className="text-slate-300">Saliente + Libre (Parcial)</span>
                                   </div>
                                </div>

                              <div className="grid grid-cols-2 gap-2">
                                  {r.weekendStats.details.map((w, idx) => (
                                       <div key={idx} className={`p-2 rounded border flex flex-col gap-1.5 ${w.isFull ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/40 border-slate-700/40 opacity-70'}`}>
                                          <div className="flex justify-between items-center">
                                              <span className="text-[10px] font-mono text-slate-400">{w.date}</span>
                                              {w.isFull && <CheckCircle2 className="w-3 h-3 text-indigo-400" />}
                                          </div>
                                          <div className="flex gap-1">
                                              <div className={`flex-1 text-center py-0.5 rounded text-[9px] font-bold border ${w.saturday === 'L' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : w.saturday === 'S' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                  S: {w.saturday}
                                              </div>
                                              <div className={`flex-1 text-center py-0.5 rounded text-[9px] font-bold border ${w.sunday === 'L' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : w.sunday === 'S' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                  D: {w.sunday}
                                              </div>
                                          </div>
                                       </div>
                                  ))}
                              </div>
                           </div>
                        )}
                      </div>
                   )
                })}
              </div>
            </section>

             {/* Vacation Analysis Section */}
            <section className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-8">
              <div className="flex items-center gap-3 mb-8">
                 <div className="bg-orange-500/20 p-3 rounded-xl text-orange-400">
                   <Plane className="w-6 h-6" />
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-white">Efecto Sándwich (Vacaciones)</h2>
                   <p className="text-slate-500 text-sm mt-1">Si pides tu ciclo de trabajo completo como vacaciones, ¿cuántos días libres consecutivos obtienes?</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 min-[1300px]:grid-cols-3 gap-6">
                {results.map(r => (
                  <div key={r.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-indigo-500/30 transition-all">
                     <div className="flex justify-between items-center mb-6">
                         <h4 className="text-lg font-bold text-white">{r.rotationName}</h4>
                         <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">{r.pattern}</span>
                     </div>
                     
                     <div className="flex items-center justify-between text-center gap-2 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 relative overflow-hidden">
                        {/* Connecting line visual in background */}
                        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-700 -z-10 -translate-y-1/2 opacity-30"></div>

                         <div className="flex flex-col items-center relative bg-slate-900/80 px-1 rounded">
                            <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Previo</span>
                            <span className="font-bold text-indigo-400 text-lg">+{r.vacationAnalysis.prev}</span>
                         </div>
                         <div className="text-slate-600 text-sm font-light">+</div>
                         <div className="flex flex-col items-center relative bg-slate-900/80 px-1 rounded">
                            <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Vacaciones</span>
                            <span className="font-bold text-white bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30 text-lg">{r.vacationAnalysis.vac}</span>
                         </div>
                         <div className="text-slate-600 text-sm font-light">+</div>
                         <div className="flex flex-col items-center relative bg-slate-900/80 px-1 rounded">
                            <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Post</span>
                            <span className="font-bold text-indigo-400 text-lg">+{r.vacationAnalysis.post}</span>
                         </div>
                         <div className="text-slate-600 text-sm font-light">=</div>
                         <div className="flex flex-col items-center relative bg-slate-900/80 px-1 rounded">
                            <span className="text-[10px] text-emerald-400 font-bold uppercase mb-1">Total</span>
                            <span className="font-black text-2xl text-white">{r.vacationAnalysis.total}</span>
                         </div>
                     </div>
                     
                     <div className="mt-4 flex justify-end">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded inline-flex items-center gap-1">
                           Factor x{r.vacationAnalysis.factor.toFixed(2)} <Tooltip content="Ratio de días libres totales por cada día gastado (aplicable solo al solicitar el ciclo completo)." />
                        </span>
                     </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-16 text-center border-2 border-dashed border-slate-800">
            <div className="bg-red-500/10 text-red-400 p-8 rounded-3xl inline-flex flex-col items-center gap-4 max-w-md border border-red-500/20">
              <AlertCircle className="w-12 h-12" />
              <h3 className="text-2xl font-bold">Datos requeridos</h3>
              <p className="text-slate-400 leading-relaxed">
                Asegúrate de que todas las rotaciones tengan valores válidos de trabajo y descanso para mostrar las gráficas.
              </p>
            </div>
          </div>
        )}
        
        <MathExplanation />

      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 py-5 z-40">
        <div className="max-w-[1300px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <div className="flex flex-wrap justify-center gap-8">
            <span className="flex items-center gap-2.5 text-red-400"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div> Trabajo</span>
            <span className="flex items-center gap-2.5 text-blue-400"><div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div> Plantilla</span>
            <span className="flex items-center gap-2.5 text-violet-400"><div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]"></div> Noches</span>
            <span className="flex items-center gap-2.5 text-amber-400"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div> Saliente</span>
            <span className="flex items-center gap-2.5 text-emerald-400"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div> Libre</span>
          </div>
          <div className="opacity-40 hover:opacity-100 transition-opacity cursor-default">
            Shift Stats v2.1 • 2025
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
