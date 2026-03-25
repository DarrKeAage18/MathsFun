import { CarryMode } from './operators/Operator';

export interface LevelConfig {
  level: number;
  digits: number;
  carryMode: CarryMode;
  pointsPerCorrect: number;
  label: string;
}

export const LEVELS: LevelConfig[] = [
  { level: 1, digits: 2, carryMode: 'without', pointsPerCorrect: 10, label: '2-digit · no carry' },
  { level: 2, digits: 2, carryMode: 'mix',     pointsPerCorrect: 15, label: '2-digit · mixed' },
  { level: 3, digits: 2, carryMode: 'with',    pointsPerCorrect: 20, label: '2-digit · with carry' },
  { level: 4, digits: 3, carryMode: 'without', pointsPerCorrect: 30, label: '3-digit · no carry' },
  { level: 5, digits: 3, carryMode: 'mix',     pointsPerCorrect: 40, label: '3-digit · mixed' },
  { level: 6, digits: 3, carryMode: 'with',    pointsPerCorrect: 50, label: '3-digit · with carry' },
  { level: 7, digits: 4, carryMode: 'without', pointsPerCorrect: 60, label: '4-digit · no carry' },
  { level: 8, digits: 4, carryMode: 'mix',     pointsPerCorrect: 70, label: '4-digit · mixed' },
  { level: 9, digits: 4, carryMode: 'with',    pointsPerCorrect: 80, label: '4-digit · with carry' },
];

export const MAX_LEVEL = LEVELS.length;

/** Minimum correct answers (out of 10) needed to advance to the next level */
export const LEVEL_UP_THRESHOLD = 8;

export function getLevelConfig(level: number): LevelConfig {
  return LEVELS[Math.min(level - 1, LEVELS.length - 1)];
}
