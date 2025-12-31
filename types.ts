
export type ShiftStatus = 'T' | 'S' | 'L'; // Trabajo, Saliente, Libre

export interface WeekendDetail {
  date: string;
  saturday: ShiftStatus;
  sunday: ShiftStatus;
  type: string | null;
  isFull: boolean;
}

export interface WeekendStats {
  totalWeekends: number;
  fullWeekends: number;
  cleanWeekends: number;
  salienteWeekends: number;
  details: WeekendDetail[];
}

export interface RotationConfig {
  id: string;
  name: string;
  workDays: number;
  restDays: number;
  nights: number;
}

export interface AnalysisResult {
  id: string;
  rotationName: string;
  pattern: string;
  cycleLength: number;
  workDays: number;
  salienteDays: number;
  libreDays: number;
  totalRestDays: number;
  totalNights: number;
  weekendStats: WeekendStats;
  vacationAnalysis: {
    prev: number;
    vac: number;
    post: number;
    total: number;
    factor: number;
  };
  staffing: {
    requiredHeadcount: number;
    limitingFactor: 'volume' | 'nights' | 'impossible';
    minStaffForVolume: number;
    minStaffForNights: number;
    effectiveWorkDays: number;
    effectiveNightsPerYear: number;
  };
}
