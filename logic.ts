
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
    
    // Safety check for invalid inputs
    const safeWorkDays = Math.max(0, isNaN(workDays) ? 0 : Math.floor(workDays));
    const safeRestDays = Math.max(0, isNaN(restDays) ? 0 : Math.floor(restDays));
    
    let currentDate = new Date(this.startDate);

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

    // Cycle length
    const cycleLength = (config.workDays || 0) + (config.restDays || 0);

    // --- NIGHTS CALCULATION (Display only) ---
    const nightsPerCycle = config.nights || 0;
    const workDaysPerCycle = config.workDays || 0;
    const totalNights = (workDaysPerCycle > 0) 
      ? Math.round(workCount * (nightsPerCycle / workDaysPerCycle))
      : 0;

    // --- VACATION ANALYSIS ---
    const vac = config.workDays || 0;
    const prev = config.restDays || 0;
    const post = config.restDays || 0;
    const total = prev + vac + post;
    const factor = vac > 0 ? total / vac : 0;

    // --- ADVANCED STAFFING CALCULATION ---
    // Constraints:
    // 1. Total Posts = 16 (12 Day + 4 Night)
    // 2. Night Posts = 4 (Must be covered specifically)
    // 3. Vacation = 24 WORKING DAYS (SHIFTS) per year.
    
    const REQUIRED_NIGHT_POSTS = 4;
    const REQUIRED_DAY_POSTS = 12;
    const TOTAL_POSTS = REQUIRED_DAY_POSTS + REQUIRED_NIGHT_POSTS; // 16
    const CALENDAR_DAYS = 365;
    const VACATION_SHIFTS = 24; // Fixed working days (shifts)

    // Annual Demand (Shifts)
    const demandTotalShifts = TOTAL_POSTS * CALENDAR_DAYS; // 16 * 365 = 5840
    const demandNightShifts = REQUIRED_NIGHT_POSTS * CALENDAR_DAYS; // 4 * 365 = 1460

    // Individual Capacity (Shifts per person per year)
    // Gross Capacity = How many shifts would I work if I worked 365 days?
    const cyclesPerPersonYear = cycleLength > 0 ? CALENDAR_DAYS / cycleLength : 0;
    const grossWorkDaysPerPerson = cyclesPerPersonYear * workDaysPerCycle;
    
    // Effective Capacity = Gross Capacity - 24 Vacation Shifts
    const effectiveWorkDaysPerPerson = Math.max(0, grossWorkDaysPerPerson - VACATION_SHIFTS);

    // Night Capacity Calculation
    // We assume vacation days are taken proportionally across the shift pattern.
    // Ratio of nights within work days:
    const nightRatio = workDaysPerCycle > 0 ? nightsPerCycle / workDaysPerCycle : 0;
    
    // We lose nights proportional to the 24 vacation shifts taken
    const lostNightsToVacation = VACATION_SHIFTS * nightRatio;
    
    const grossNightsPerPerson = cyclesPerPersonYear * nightsPerCycle;
    const effectiveNightsPerPerson = Math.max(0, grossNightsPerPerson - lostNightsToVacation);

    // 1. Headcount needed for TOTAL VOLUME (Volume Constraint)
    let minStaffForVolume = 0;
    if (effectiveWorkDaysPerPerson > 0) {
        minStaffForVolume = demandTotalShifts / effectiveWorkDaysPerPerson;
    }

    // 2. Headcount needed for NIGHT COVERAGE (Structural Constraint)
    let minStaffForNights = 0;
    if (nightsPerCycle === 0) {
        // Impossible to cover nights if the rotation has 0 nights
        minStaffForNights = Infinity; 
    } else {
        minStaffForNights = demandNightShifts / effectiveNightsPerPerson;
    }

    // Final Determination
    let requiredHeadcount = 0;
    let limitingFactor: 'volume' | 'nights' | 'impossible' = 'volume';

    if (minStaffForNights === Infinity) {
        limitingFactor = 'impossible';
        requiredHeadcount = 0;
    } else {
        // We need the maximum of the two constraints to satisfy BOTH.
        if (minStaffForNights > minStaffForVolume) {
            limitingFactor = 'nights';
            requiredHeadcount = Math.ceil(minStaffForNights);
        } else {
            limitingFactor = 'volume';
            requiredHeadcount = Math.ceil(minStaffForVolume);
        }
    }

    // Pattern string reconstruction
    const cleanRestDisplay = Math.max(0, (config.restDays || 0) - 1);
    const patternStr = `${config.workDays || 0} (${nightsPerCycle}N) - S - ${cleanRestDisplay}`;

    return {
      id: config.id,
      rotationName: config.name,
      pattern: patternStr,
      cycleLength,
      workDays: workCount,
      salienteDays: salienteCount,
      libreDays: libreCount,
      totalRestDays: salienteCount + libreCount,
      totalNights,
      weekendStats,
      vacationAnalysis: {
        prev, vac, post, total, factor
      },
      staffing: {
        requiredHeadcount,
        limitingFactor,
        minStaffForVolume: Math.ceil(minStaffForVolume),
        minStaffForNights: minStaffForNights === Infinity ? 0 : Math.ceil(minStaffForNights),
        effectiveWorkDays: Math.floor(effectiveWorkDaysPerPerson),
        effectiveNightsPerYear: Math.floor(effectiveNightsPerPerson)
      }
    };
  }
}
