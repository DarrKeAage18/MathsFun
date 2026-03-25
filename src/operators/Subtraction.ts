import { Operator, Problem } from './Operator';

export class Subtraction extends Operator {
  readonly symbol = '-';

  make(withBorrow: boolean, digits: number): Problem {
    let a: number, b: number;
    let tries = 0;
    do {
      a = this.nDigit(digits);
      b = this.nDigit(digits);
      tries++;
      if (tries > 300) break;
      // ensure positive result and borrow condition
    } while (
      a <= b ||
      (withBorrow  && (a % 10) >= (b % 10)) ||
      (!withBorrow && (a % 10)  < (b % 10))
    );

    return { a, b, op: this.symbol, answer: a - b, digits };
  }
}
