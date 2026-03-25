export interface Problem {
  a: number;
  b: number;
  op: string;
  answer: number;
  digits: number;
}

export type CarryMode = 'with' | 'without' | 'mix';

export abstract class Operator {
  abstract readonly symbol: string;

  abstract make(withCarry: boolean, digits: number): Problem;

  protected rnd(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Returns a random number with exactly `digits` digits */
  protected nDigit(digits: number): number {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return this.rnd(min, max);
  }

  generateSet(carryMode: CarryMode, digits: number): Problem[] {
    const problems: Problem[] = [];

    if (carryMode === 'with') {
      for (let i = 0; i < 10; i++) problems.push(this.make(true, digits));
    } else if (carryMode === 'without') {
      for (let i = 0; i < 10; i++) problems.push(this.make(false, digits));
    } else {
      for (let i = 0; i < 5; i++) problems.push(this.make(true, digits));
      for (let i = 0; i < 5; i++) problems.push(this.make(false, digits));
    }

    // Fisher-Yates shuffle
    for (let i = problems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [problems[i], problems[j]] = [problems[j], problems[i]];
    }

    return problems;
  }
}
