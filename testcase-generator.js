// Calculate the check digit that would make a number pass Luhn validation
const calculateLuhnCheckDigit = (partialDigits) => {
    // Create a copy and add a placeholder 0 for the check digit
    const digits = [...partialDigits, 0];
    let sum = 0;
    let double = true;
    // Process from right to left
    for (let i = digits.length - 2; i >= 0; i--) {
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
    // Calculate the check digit that makes the sum divisible by 10
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
};
// Luhn algorithm validation (from your code)
const isLuhnValid = (digits) => {
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
// Generate a random digit from 0-9
const randomDigit = () => Math.floor(Math.random() * 10);
// Generate random digits of specified length
const generateRandomDigits = (length) => {
    if (length <= 0 || !Number.isInteger(length)) {
        throw new Error("Length must be a positive integer.");
    }
    return Array.from({ length }, () => randomDigit());
};
// Credit card formats and their specifications
const cardFormats = [
    {
        name: "Visa",
        lengths: [16],
        prefixes: ["4"],
    },
    {
        name: "Mastercard",
        lengths: [16],
        prefixes: ["51", "52", "53", "54", "55"],
    },
    {
        name: "American Express",
        lengths: [15],
        prefixes: ["34", "37"],
    },
    {
        name: "Discover",
        lengths: [16],
        prefixes: ["6011", "644", "645", "646", "647", "648", "649", "65"],
    },
];
// Generate a card number for a specific format
const generateCardNumber = (format, shouldBeValid) => {
    const length = format.lengths[Math.floor(Math.random() * format.lengths.length)];
    const prefix = format.prefixes[Math.floor(Math.random() * format.prefixes.length)];
    // Convert prefix to array of digits
    const prefixDigits = prefix.split("").map(Number);
    // Generate random digits for the remaining length (excluding the check digit)
    const randomDigs = generateRandomDigits(length - prefixDigits.length - 1);
    // Combine prefix and random digits
    const partialDigits = [...prefixDigits, ...randomDigs];
    // Calculate the check digit
    const correctCheckDigit = calculateLuhnCheckDigit(partialDigits);
    // If we want an invalid card, use a different check digit
    const checkDigit = shouldBeValid
        ? correctCheckDigit
        : (correctCheckDigit + 1 + Math.floor(Math.random() * 8)) % 10;
    // Add the check digit and convert to string
    const allDigits = [...partialDigits, checkDigit];
    return allDigits.join("");
};
// Generate test cases
const generateTestCases = (count, validRatio = 0.7) => {
    const testCases = [];
    const validCount = Math.floor(count * validRatio);
    const invalidCount = count - validCount;
    // For each of the card formats
    for (const format of cardFormats) {
        // Generate valid cases
        for (let i = 0; i < validCount; i++) {
            const cardNumber = generateCardNumber(format, true);
            testCases.push({
                cardType: format.name,
                cardNumber,
                shouldBeValid: true,
            });
        }
        // Generate invalid cases
        for (let i = 0; i < invalidCount; i++) {
            const cardNumber = generateCardNumber(format, false);
            testCases.push({
                cardType: format.name,
                cardNumber,
                shouldBeValid: false,
            });
        }
    }
    return testCases;
};
// Generate 10 test cases with 70% valid
const testCases = generateTestCases(10, 0.7);
console.log(JSON.stringify(testCases, null, 2));
testCases;
export {};
