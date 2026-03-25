import { Operator, Problem } from './Operator';

export class Addition extends Operator {
  readonly symbol = '+';

  make(withCarry: boolean, digits: number): Problem {
    let a: number, b: number;
    let tries = 0;
    do {
      a = this.nDigit(digits);
      b = this.nDigit(digits);
      tries++;
      if (tries > 300) break;
    } while (withCarry ? (a % 10 + b % 10) < 10 : (a % 10 + b % 10) >= 10);

    return { a, b, op: this.symbol, answer: a + b, digits };
  }
}
