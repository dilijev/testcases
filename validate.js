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
// Validation script to check our generated test cases
var validateTestCases = function (testCases) {
    var passedTests = 0;
    var failedTests = 0;
    for (var _i = 0, testCases_1 = testCases; _i < testCases_1.length; _i++) {
        var testCase = testCases_1[_i];
        var digits = testCase.cardNumber.split("").map(Number);
        var isValid = isLuhnValid(digits);
        if (isValid === testCase.shouldBeValid) {
            passedTests++;
        }
        else {
            failedTests++;
            console.error("Test failed for ".concat(testCase.cardType, ": ").concat(testCase.cardNumber));
            console.error("  Expected validity: ".concat(testCase.shouldBeValid, ", Got: ").concat(isValid));
        }
    }
    console.log("Validation complete: ".concat(passedTests, " passed, ").concat(failedTests, " failed"));
    if (failedTests === 0) {
        console.log("All test cases are valid! Ready to use in your testing suite.");
    }
};
var testCases;
// Assuming testCases is loaded from the JSON file
validateTestCases(testCases);
