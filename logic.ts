
import { 
  ShiftStatus, 
  WeekendDetail, 
  WeekendStats, 
  RotationConfig, 
  AnalysisResult 
} from './types';

export class ShiftRotationAnalyzer {
  private year: number;
  private startDate: Date;
  private endDate: Date;

  constructor(year: number, startDate: Date) {
    this.year = year;
    this.startDate = new Date(startDate);
    this.endDate = new Date(year, 11, 31); // Dec 31
  }

  generateRotationCalendar(workDays: number, restDays: number): { date: Date; status: ShiftStatus }[] {
    const calendar: { date: Date; status: ShiftStatus }[] = [];
    
    // Safety check for invalid inputs that could cause RangeError: Invalid array length
    const safeWorkDays = Math.max(0, isNaN(workDays) ? 0 : Math.floor(workDays));
    const safeRestDays = Math.max(0, isNaN(restDays) ? 0 : Math.floor(restDays));
    
    let currentDate = new Date(this.startDate);

    // Logic Update: User inputs TOTAL rest days. 
    // The first rest day is 'S' (Saliente), the remaining are 'L' (Libre).
    // If restDays is 0, no rest. If restDays is 1, only 'S'.
    
    const cleanRestDays = Math.max(0, safeRestDays - 1);
    const hasSaliente = safeRestDays > 0;

    const pattern: ShiftStatus[] = [
      ...Array(safeWorkDays).fill('T' as ShiftStatus)
    ];

    if (hasSaliente) {
      pattern.push('S' as ShiftStatus);
      pattern.push(...Array(cleanRestDays).fill('L' as ShiftStatus));
    }

    const cycleLength = pattern.length;
    let dayInCycle = 0;

    if (cycleLength === 0) return [];

    while (currentDate <= this.endDate) {
      const status = pattern[dayInCycle];
      calendar.push({ date: new Date(currentDate), status });

      currentDate.setDate(currentDate.getDate() + 1);
      dayInCycle = (dayInCycle + 1) % cycleLength;
    }

    return calendar;
  }

  countFullWeekends(calendar: { date: Date; status: ShiftStatus }[]): WeekendStats {
    const dateStatus: Record<string, ShiftStatus> = {};
    calendar.forEach(item => {
      dateStatus[item.date.toISOString().split('T')[0]] = item.status;
    });

    const weekends: WeekendDetail[] = [];
    let currentDate = new Date(this.startDate);

    while (currentDate <= this.endDate) {
      if (currentDate.getDay() === 6) {
        const saturday = new Date(currentDate);
        const sunday = new Date(currentDate);
        sunday.setDate(sunday.getDate() + 1);

        if (sunday <= this.endDate) {
          const satKey = saturday.toISOString().split('T')[0];
          const sunKey = sunday.toISOString().split('T')[0];
          
          const satStatus = dateStatus[satKey] || 'T';
          const sunStatus = dateStatus[sunKey] || 'T';

          let weekendType: string | null = null;
          let isFull = false;

          if (satStatus === 'L' && sunStatus === 'L') {
            weekendType = 'Limpio (L+L)';
            isFull = true;
          } else if (satStatus === 'S' && sunStatus === 'L') {
            weekendType = 'Saliente (S+L)';
            isFull = true;
          } else if (satStatus === 'L' && sunStatus === 'S') {
            weekendType = 'Saliente (L+S)';
            isFull = true;
          } else if (satStatus === 'S' && sunStatus === 'S') {
            weekendType = 'Saliente (S+S)';
            isFull = true;
          }

          weekends.push({
            date: saturday.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            saturday: satStatus,
            sunday: sunStatus,
            type: weekendType,
            isFull
          });
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const fullWeekends = weekends.filter(w => w.isFull);
    const cleanWeekends = fullWeekends.filter(w => w.type === 'Limpio (L+L)');
    const salienteWeekends = fullWeekends.filter(w => w.type?.includes('Saliente'));

    return {
      totalWeekends: weekends.length,
      fullWeekends: fullWeekends.length,
      cleanWeekends: cleanWeekends.length,
      salienteWeekends: salienteWeekends.length,
      details: weekends
    };
  }

  analyzeRotation(config: RotationConfig): AnalysisResult {
    const calendar = this.generateRotationCalendar(config.workDays, config.restDays);
    const weekendStats = this.countFullWeekends(calendar);

    const workCount = calendar.filter(c => c.status === 'T').length;
    const salienteCount = calendar.filter(c => c.status === 'S').length;
    const libreCount = calendar.filter(c => c.status === 'L').length;

    // Cycle length is simply Work + Rest (since Rest includes Saliente inside logic now)
    const cycleLength = (config.workDays || 0) + (config.restDays || 0);

    // Vacation Analysis
    // Logic: Taking the work block (workDays) as vacation connects the previous rest block and the next rest block.
    // config.restDays is now the total rest block size.
    
    const vac = config.workDays || 0;
    const prev = config.restDays || 0;
    const post = config.restDays || 0;
    const total = prev + vac + post;
    const factor = vac > 0 ? total / vac : 0;

    // Pattern string reconstruction for display: e.g. "6-S-2" if input was 6 work 3 rest
    const cleanRestDisplay = Math.max(0, (config.restDays || 0) - 1);
    const patternStr = `${config.workDays || 0}-S-${cleanRestDisplay}`;

    return {
      id: config.id,
      rotationName: config.name,
      pattern: patternStr,
      cycleLength,
      workDays: workCount,
      salienteDays: salienteCount,
      libreDays: libreCount,
      totalRestDays: salienteCount + libreCount,
      weekendStats,
      vacationAnalysis: {
        prev, vac, post, total, factor
      }
    };
  }
}
