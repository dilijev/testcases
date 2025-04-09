var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
// Calculate the check digit that would make a number pass Luhn validation
var calculateLuhnCheckDigit = function (partialDigits) {
    // Create a copy and add a placeholder 0 for the check digit
    var digits = __spreadArray(__spreadArray([], partialDigits, true), [0], false);
    var sum = 0;
    var double = true;
    // Process from right to left
    for (var i = digits.length - 2; i >= 0; i--) {
        var value = digits[i];
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
    var checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit;
};
// Luhn algorithm validation (from your code)
var isLuhnValid = function (digits) {
    var sum = 0;
    var double = false;
    // Process from right to left
    for (var i = digits.length - 1; i >= 0; i--) {
        var value = digits[i];
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
var randomDigit = function () { return Math.floor(Math.random() * 10); };
// Generate random digits of specified length
var generateRandomDigits = function (length) {
    if (length <= 0 || !Number.isInteger(length)) {
        throw new Error("Length must be a positive integer.");
    }
    return Array.from({ length: length }, function () {
        return randomDigit();
    });
};
var cardFormats = [
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
var generateCardNumber = function (format, shouldBeValid) {
    var length = format.lengths[Math.floor(Math.random() * format.lengths.length)];
    var prefix = format.prefixes[Math.floor(Math.random() * format.prefixes.length)];
    // Convert prefix to array of digits
    var prefixDigits = prefix.split("").map(Number);
    // Generate random digits for the remaining length (excluding the check digit)
    var randomDigs = generateRandomDigits(length - prefixDigits.length - 1);
    // Combine prefix and random digits
    var partialDigits = __spreadArray(__spreadArray([], prefixDigits, true), randomDigs, true);
    // Calculate the check digit
    var correctCheckDigit = calculateLuhnCheckDigit(partialDigits);
    // If we want an invalid card, use a different check digit
    var checkDigit = shouldBeValid
        ? correctCheckDigit
        : (correctCheckDigit + 1 + Math.floor(Math.random() * 8)) % 10;
    // Add the check digit and convert to string
    var allDigits = __spreadArray(__spreadArray([], partialDigits, true), [checkDigit], false);
    return allDigits.join("");
};
// Generate test cases
var generateTestCases = function (count, validRatio) {
    if (validRatio === void 0) { validRatio = 0.7; }
    var testCases = [];
    var validCount = Math.floor(count * validRatio);
    var invalidCount = count - validCount;
    // For each of the card formats
    for (var _i = 0, cardFormats_1 = cardFormats; _i < cardFormats_1.length; _i++) {
        var format = cardFormats_1[_i];
        // Generate valid cases
        for (var i = 0; i < validCount; i++) {
            var cardNumber = generateCardNumber(format, true);
            testCases.push({
                cardType: format.name,
                cardNumber: cardNumber,
                shouldBeValid: true,
            });
        }
        // Generate invalid cases
        for (var i = 0; i < invalidCount; i++) {
            var cardNumber = generateCardNumber(format, false);
            testCases.push({
                cardType: format.name,
                cardNumber: cardNumber,
                shouldBeValid: false,
            });
        }
    }
    return testCases;
};
// Generate 10 test cases with 70% valid
var testCases = generateTestCases(10, 0.7);
console.log(JSON.stringify(testCases, null, 2));
testCases;
