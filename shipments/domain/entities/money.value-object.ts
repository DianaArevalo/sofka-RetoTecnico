export class Money {
  private readonly _value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('El valor no puede ser negativo');
    }
    this._value = Math.round(value * 100) / 100;
  }

  get value(): number {
    return this._value;
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  multiply(factor: number): Money {
    return new Money(this._value * factor);
  }

  static fromNumber(value: number): Money {
    return new Money(value);
  }
}