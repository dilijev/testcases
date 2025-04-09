import { TestCase } from './types.js';
import * as fs from 'fs';
import * as path from 'path';

// Luhn algorithm validation (from your code)
const isLuhnValid = (digits: number[]): boolean => {
  let sum = 0;
  let double = false;

  // Process from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let value = digits[i];

    if (double) {
      value *= 2;
      if (value > 9) {
        value -= 9;
      }
    }

    sum += value;
    double = !double;
  }

  return sum % 10 === 0;
};

// Validation script to check our generated test cases
const validateTestCases = (testCases: TestCase[]): void => {
  let passedTests = 0;
  let failedTests = 0;

  for (const testCase of testCases) {
    const digits = testCase.cardNumber.split("").map(Number);
    const isValid = isLuhnValid(digits);

    if (isValid === testCase.shouldBeValid) {
      passedTests++;
    } else {
      failedTests++;
      console.error(`Test failed for ${testCase.cardType}: ${testCase.cardNumber}`);
      console.error(`  Expected validity: ${testCase.shouldBeValid}, Got: ${isValid}`);
    }
  }

  console.log(`Validation complete: ${passedTests} passed, ${failedTests} failed`);
  if (failedTests === 0) {
    console.log("All test cases are valid! Ready to use in your testing suite.");
  }
}

// load test cases from JSON file test-cases.json (using node.js types)
let testCases: TestCase[];
const testCasesPath = path.resolve(__dirname, 'test-cases.json');

try {
  const data = fs.readFileSync(testCasesPath, 'utf-8');
  testCases = JSON.parse(data) as TestCase[];
} catch (error) {
  console.error(`Failed to load test cases from ${testCasesPath}:`, error);
  process.exit(1);
}

// Assuming testCases is loaded from the JSON file
validateTestCases(testCases);
