
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
  Sunrise
} from 'lucide-react';
import { RotationConfig, AnalysisResult } from './types';
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

const App: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear() + 1);
  const [startDate, setStartDate] = useState(`${new Date().getFullYear() + 1}-01-01`);
  // Default values updated to intuitive format: Work Days, Total Rest Days
  const [rotations, setRotations] = useState<RotationConfig[]>([
    { id: '1', name: 'Actual (6-3)', workDays: 6, restDays: 3 },
    { id: '2', name: 'Opción A (5-3)', workDays: 5, restDays: 3 },
    { id: '3', name: 'Opción B (6-4)', workDays: 6, restDays: 4 },
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
    // Default to a standard 5 work, 3 rest (2 clean) rotation
    setRotations([...rotations, { id: newId, name: `Nueva ${rotations.length + 1}`, workDays: 5, restDays: 3 }]);
  };

  const removeRotation = (id: string) => {
    setRotations(rotations.filter(r => r.id !== id));
  };

  const updateRotation = (id: string, field: keyof RotationConfig, value: string) => {
    setRotations(rotations.map(r => {
      if (r.id === id) {
        if (field === 'name') return { ...r, [field]: value };
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
    // If lowerIsBetter (e.g. work days): positive diff is BAD (red), negative diff is GOOD (green)
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 selection:bg-indigo-500/30">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Panel de Configuración */}
        <section className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-semibold text-white">Configuración General</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Año <Tooltip content="Año calendario sobre el que se calculan todos los días y estadísticas." />
                  </label>
                  <input 
                    type="number" 
                    value={isNaN(year) ? "" : year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Inicio de ciclo <Tooltip content="La fecha de tu primer día de trabajo (T) del año. Esencial para sincronizar la rotación." />
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 space-y-4">
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
              
              <div className="grid grid-cols-1 gap-3">
                {rotations.map((rotation, index) => {
                  const isWorkValid = !isNaN(rotation.workDays) && rotation.workDays > 0;
                  const isRestValid = !isNaN(rotation.restDays) && rotation.restDays >= 0;

                  return (
                    <div key={rotation.id} className="grid grid-cols-12 gap-3 items-start bg-slate-800/50 p-4 rounded-xl border border-slate-700 relative group">
                      {index === 0 && (
                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 -translate-x-full pr-3 hidden lg:block">
                           <span className="text-[10px] uppercase font-bold text-slate-500 rotate-270 whitespace-nowrap bg-slate-900 px-2 py-1 rounded border border-slate-800">Referencia</span>
                        </div>
                      )}
                      <div className="col-span-12 sm:col-span-4">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">
                          Nombre <Tooltip content="Identificador para diferenciar opciones en la comparativa." />
                        </label>
                        <input 
                          value={rotation.name}
                          onChange={(e) => updateRotation(rotation.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div className="col-span-5 sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">
                          Días Trabajo <Tooltip content="Número de días consecutivos que trabajas (Turno)." />
                        </label>
                        <input 
                          type="number"
                          placeholder="Ej: 6"
                          value={isNaN(rotation.workDays) ? "" : rotation.workDays}
                          onChange={(e) => updateRotation(rotation.id, 'workDays', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg bg-slate-800 border text-white text-sm outline-none transition-all ${isWorkValid ? 'border-slate-700 focus:ring-indigo-500' : 'border-red-500/50 bg-red-500/5 focus:ring-red-500'}`}
                        />
                        {!isWorkValid && <p className="text-[10px] text-red-400 font-medium mt-1">Obligatorio</p>}
                      </div>
                      <div className="col-span-5 sm:col-span-3">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">
                          Días Libres (Total) <Tooltip content="Total de días de descanso. El sistema cuenta el primero como 'Saliente' y los restantes como 'Libres'." />
                        </label>
                        <input 
                          type="number"
                          placeholder="Ej: 3"
                          value={isNaN(rotation.restDays) ? "" : rotation.restDays}
                          onChange={(e) => updateRotation(rotation.id, 'restDays', e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg bg-slate-800 border text-white text-sm outline-none transition-all ${isRestValid ? 'border-slate-700 focus:ring-indigo-500' : 'border-red-500/50 bg-red-500/5 focus:ring-red-500'}`}
                        />
                        {!isRestValid && <p className="text-[10px] text-red-400 font-medium mt-1">Obligatorio</p>}
                      </div>
                      <div className="col-span-2 sm:col-span-2 flex justify-end pt-5">
                        <button 
                          onClick={() => removeRotation(rotation.id)}
                          disabled={rotations.length <= 1}
                          className="p-2 text-slate-500 hover:text-red-400 disabled:opacity-20 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {bestRotation && (
                <div className="lg:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
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
                          Trabajo (T) <Tooltip content="Días totales trabajados al año." />
                        </span>
                        <span className="text-2xl font-black">{bestRotation.workDays}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center">
                        <span className="block text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                          Saliente (S) <Tooltip content="Días de salida de turno (cuentan como descanso pero no son días libres completos)." />
                        </span>
                        <span className="text-2xl font-black">{bestRotation.salienteDays}</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-center">
                        <span className="block text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">
                          Libre (L) <Tooltip content="Días de descanso completo (24h)." />
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
                        <Sparkles className="w-3 h-3" /> L+L (Completo)
                      </span>
                      <span className="text-slate-400">Sábado y Domingo Libres</span>
                   </div>
                   <div className="flex justify-between items-center text-xs border-t border-slate-700/50 pt-2">
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Sunrise className="w-3 h-3" /> S+L (Parcial)
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
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
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
                    <Bar name="Findes Libres (Total)" dataKey="weekendStats.fullWeekends" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    <Bar name="Días Libres" dataKey="libreDays" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Tabla Detallada Responsive */}
            <section className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
              <div className="px-6 sm:px-8 py-6 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Resumen de Días Anuales</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">Año {year}</span>
              </div>
              
              {/* Desktop View (Table) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900/50 border-b border-slate-800">
                    <tr>
                      <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Rotación <Tooltip content="Configuración de turno seleccionada." />
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                        Trabajo (T) <Tooltip content="Días totales de trabajo al año." />
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                        Saliente (S) <Tooltip content="Días de salida de turno." />
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                        Libre (L) <Tooltip content="Días completamente libres." />
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                        Total Descanso <Tooltip content="Suma de días Saliente y días Libres." />
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                        Findes Full <Tooltip content="Fines de semana con Sábado y Domingo sin trabajo (L+L o S+L)." />
                      </th>
                      <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {results.map((r, index) => {
                       const baseline = results[0];
                       const isBaseline = index === 0;
                       const isActive = activeDetailId === r.id;

                       return (
                      <React.Fragment key={r.id}>
                      <tr className={`transition-colors group ${isActive ? 'bg-slate-800/80' : 'hover:bg-slate-800/50'}`}>
                        <td className="px-8 py-5">
                          <div className="font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                             {r.rotationName}
                             {isBaseline && <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded uppercase tracking-wider">Base</span>}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{r.pattern}</div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center gap-1.5 font-bold text-red-400 bg-red-400/10 px-3 py-1.5 rounded-xl border border-red-400/20">
                            <Clock className="w-3.5 h-3.5" /> {r.workDays}
                          </span>
                          {!isBaseline && getDifference(r.workDays, baseline.workDays, true)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center gap-1.5 font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                            <Moon className="w-3.5 h-3.5" /> {r.salienteDays}
                          </span>
                          {!isBaseline && getDifference(r.salienteDays, baseline.salienteDays)}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-400/20">
                            <Coffee className="w-3.5 h-3.5" /> {r.libreDays}
                          </span>
                          {!isBaseline && getDifference(r.libreDays, baseline.libreDays)}
                        </td>
                        <td className="px-6 py-5 text-center font-medium text-slate-400">
                          {r.totalRestDays} días
                          {!isBaseline && getDifference(r.totalRestDays, baseline.totalRestDays)}
                        </td>
                        <td className="px-6 py-5 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-xl font-black text-white flex items-center">
                                    {r.weekendStats.fullWeekends}
                                    {!isBaseline && getDifference(r.weekendStats.fullWeekends, baseline.weekendStats.fullWeekends)}
                                </div>
                                <div className="flex gap-3 mt-1.5 border-t border-slate-700 pt-1.5 px-2">
                                    <div className="flex flex-col items-center" title="Sábado y Domingo Libres">
                                       <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Sáb+Dom</span>
                                       <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                          <Sparkles className="w-3 h-3" />
                                          {r.weekendStats.cleanWeekends}
                                       </span>
                                    </div>
                                    <div className="w-px bg-slate-700 h-6"></div>
                                    <div className="flex flex-col items-center" title="Sábado Saliente y Domingo Libre">
                                       <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">Sal+Dom</span>
                                       <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                          <Sunrise className="w-3 h-3" />
                                          {r.weekendStats.salienteWeekends}
                                       </span>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => setActiveDetailId(activeDetailId === r.id ? null : r.id)}
                            className={`text-sm font-bold flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${isActive ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'text-slate-400 hover:text-indigo-400 border-transparent hover:bg-slate-700/50'}`}
                          >
                            {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            Detalles
                          </button>
                        </td>
                      </tr>
                      {isActive && (
                        <tr>
                          <td colSpan={7} className="p-0 border-b border-slate-800">
                             <div className="bg-slate-950/30 p-6 shadow-[inset_0_4px_10px_rgba(0,0,0,0.2)] animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                     <div className="bg-indigo-500/20 p-2 rounded-lg">
                                       <Calendar className="w-5 h-5 text-indigo-400" />
                                     </div>
                                     <div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Detalle de Fines de Semana</h3>
                                        <p className="text-xs text-slate-500">Visualización completa del calendario para <span className="text-indigo-400 font-semibold">{r.rotationName}</span></p>
                                     </div>
                                </div>

                                {/* Expanded Detail Legend */}
                                <div className="flex flex-col sm:flex-row gap-4 mb-6 text-xs bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                   <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
                                      <span className="text-slate-300"><strong className="text-emerald-400">L+L (Completo):</strong> Sábado y Domingo Libres.</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                                      <span className="text-slate-300"><strong className="text-amber-400">S+L (Parcial):</strong> Sábado Saliente + Domingo Libre.</span>
                                   </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {r.weekendStats.details.map((w, idx) => (
                                         <div key={idx} className={`p-3 rounded-lg border flex flex-col gap-2 transition-all hover:scale-[1.02] ${w.isFull ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-slate-800/40 border-slate-700/40 opacity-60 hover:opacity-100 hover:bg-slate-800'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-slate-400 font-medium">{w.date}</span>
                                                {w.isFull ? <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-600" />}
                                            </div>
                                            <div className="flex gap-2">
                                                <div className={`flex-1 text-center py-1 px-1 rounded text-[10px] font-bold border ${w.saturday === 'L' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : w.saturday === 'S' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                    S: {w.saturday}
                                                </div>
                                                <div className={`flex-1 text-center py-1 px-1 rounded text-[10px] font-bold border ${w.sunday === 'L' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : w.sunday === 'S' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                    D: {w.sunday}
                                                </div>
                                            </div>
                                            <div className={`text-[10px] font-bold text-center truncate ${w.isFull ? 'text-indigo-300' : 'text-slate-500'}`}>
                                                {w.type || 'Turno Trabajo'}
                                            </div>
                                         </div>
                                    ))}
                                </div>
                             </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                       )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View (Cards) */}
              <div className="lg:hidden p-4 space-y-4 bg-slate-900">
                {results.map((r, index) => {
                   const baseline = results[0];
                   const isBaseline = index === 0;
                   const isActive = activeDetailId === r.id;

                   return (
                      <div key={r.id} className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                        {/* Card Header */}
                        <div className="p-4 border-b border-slate-700/50 flex justify-between items-start">
                           <div>
                              <div className="flex items-center gap-2">
                                 <span className="font-bold text-white text-lg">{r.rotationName}</span>
                                 {isBaseline && <span className="text-[9px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded uppercase tracking-wider">Base</span>}
                              </div>
                              <div className="text-xs text-slate-500 font-mono mt-1">{r.pattern}</div>
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
                        <div className="grid grid-cols-3 divide-x divide-slate-700/50 border-b border-slate-700/50">
                           <div className="p-3 text-center">
                              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Clock className="w-3 h-3" /> T</span>
                              <span className="text-sm font-bold text-red-400">
                                 {r.workDays}
                              </span>
                              {!isBaseline && <div className="flex justify-center">{getDifference(r.workDays, baseline.workDays, true)}</div>}
                           </div>
                           <div className="p-3 text-center">
                              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Moon className="w-3 h-3" /> S</span>
                              <span className="text-sm font-bold text-amber-400">
                                 {r.salienteDays}
                              </span>
                              {!isBaseline && <div className="flex justify-center">{getDifference(r.salienteDays, baseline.salienteDays)}</div>}
                           </div>
                           <div className="p-3 text-center">
                              <span className="block text-[10px] text-slate-500 font-bold uppercase mb-1 flex justify-center items-center gap-1"><Coffee className="w-3 h-3" /> L</span>
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
                                  <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider mb-0.5">Sáb+Dom</span>
                                  <div className="flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-emerald-400" />
                                      <span className="text-sm font-bold text-emerald-400">{r.weekendStats.cleanWeekends}</span>
                                  </div>
                               </div>
                               <div className="w-px bg-slate-700 h-8 self-center"></div>
                               <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">Sal+Dom</span>
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

                        {/* Details Panel Mobile */}
                        {isActive && (
                           <div className="p-4 border-t border-slate-700 bg-slate-950/30">
                              <div className="mb-4">
                                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Detalle de Fines de Semana</h3>
                                  <p className="text-[10px] text-slate-500">Calendario completo para <span className="text-indigo-400">{r.rotationName}</span></p>
                              </div>

                              {/* Mobile Legend */}
                              <div className="grid grid-cols-1 gap-2 mb-4 text-[10px] bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                   <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                      <span className="text-slate-300">L+L (Completo)</span>
                                   </div>
                                   <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                      <span className="text-slate-300">S+L (Parcial)</span>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map(r => (
                  <div key={r.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 hover:border-indigo-500/30 transition-all">
                     <h4 className="text-lg font-bold text-white mb-6 flex justify-between items-center">
                        {r.rotationName}
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">{r.pattern}</span>
                     </h4>
                     <div className="space-y-4 relative">
                       {/* Connection Line */}
                       <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-700 -z-10"></div>
                       
                       <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600"></div>
                            <span className="text-slate-400 font-medium">Descanso Previo <Tooltip content="Días libres que ya te correspondían antes de las vacaciones." /></span>
                         </div>
                         <span className="font-bold text-indigo-400">+{r.vacationAnalysis.prev} días</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <span className="text-white font-bold">Tus Vacaciones <Tooltip content="Días de vacaciones solicitados (equivalentes al turno de trabajo)." /></span>
                         </div>
                         <span className="font-bold text-white bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">{r.vacationAnalysis.vac} días</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-600"></div>
                            <span className="text-slate-400 font-medium">Descanso Post <Tooltip content="Días libres que te corresponden después de las vacaciones." /></span>
                         </div>
                         <span className="font-bold text-indigo-400">+{r.vacationAnalysis.post} días</span>
                       </div>
                     </div>
                     
                     <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between items-center">
                         <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center">
                           Total Consecutivo <Tooltip content="Días totales fuera del trabajo." />
                         </div>
                         <div className="text-right">
                            <span className="block text-2xl font-black text-white">{r.vacationAnalysis.total} días</span>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-1.5 py-0.5 rounded mt-1 inline-flex items-center gap-1">
                               Factor x{r.vacationAnalysis.factor.toFixed(2)} <Tooltip content="Ratio de días libres totales por cada día gastado (aplicable solo al solicitar el ciclo completo)." />
                            </span>
                         </div>
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

      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 py-5 z-40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          <div className="flex flex-wrap justify-center gap-8">
            <span className="flex items-center gap-2.5 text-red-400"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div> Trabajo (T)</span>
            <span className="flex items-center gap-2.5 text-amber-400"><div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div> Saliente (S)</span>
            <span className="flex items-center gap-2.5 text-emerald-400"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div> Libre (L)</span>
          </div>
          <div className="opacity-40 hover:opacity-100 transition-opacity cursor-default">
            Shift Stats v2.0 • 2025
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
