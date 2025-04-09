export interface TestCase {
  cardType: string;
  cardNumber: string;
  shouldBeValid: boolean;
}

export interface CardFormat {
  name: string;
  lengths: number[];
  prefixes: string[];
}
