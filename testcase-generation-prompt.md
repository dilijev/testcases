Consider the Luhn checksum for credit cards

```
// Luhn algorithm validation
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
}
```

I need to generate some CC test cases for VISA, Mastercard, Discover, American Express, and a few other banks. I need about 70% valid credit card numbers which pass the Luhn validation, and some which deliberately do not pass the checksum (approx 30%) but which otherwise match the formats for those cards.

Write me a function to randomly generate a credit card number for a given format (number of digits) until the last possible moment where generation of a number will be forced in order to pass the Luhn checksum.

Is it valid to assume that this means that all numbers except for the final number of a credit card can be random, and that the last number can be calculated?

If so, write such a function that can calculated the last digit, the Luhn check digit.

Use all of these functions to generate some number N of test cases that are valid for every type of card, minding the restrictions on range and format for those card types (again, VISA, Mastercard, Discover, American Express).

Is it valid to assume that all credit card numbers can be represented as a number of digits, if you ignore the spaces and dashes that sometimes accompany CC formats?

We're writing a unit test data generator. Include whether the generated data *should* pass or not. Output in the form of lines in a JSON file.

Then, write a script that will take that JSON file output and check whether the generations DID in fact pass the Luhn sum when they are supposed to, or not pass when they are not supposed to. If this passes, we can consider generation successful, and we'll start using these test cases to check our code, which will use RegExp to detect Credit Card numbers in a text, then decide whether they are valid numbers, and if they are valid numbers, it will redact them from the text.
