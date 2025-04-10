export function checkTestCaseCorrectlyRedacted(tc) {
    const isRedacted = tc.redacted;
    const expectRedacted = tc.elem.classList.contains("expectRedacted");
    return isRedacted === expectRedacted;
}
export function checkForRedacted() {
    const container = document.querySelector(".testcases");
    // Remove existing 'testresults' element if it exists
    const existingResults = container.querySelector(".testresults");
    if (existingResults) {
        existingResults.remove();
    }
    const testCases = Array.from(document.querySelectorAll(".testcase")).map((e) => ({
        elem: e,
        text: e.textContent || "",
        redacted: (e.textContent || "").includes("█"),
    }));
    let passedTests = 0;
    testCases.forEach((tc) => {
        let resultSpan = tc.elem.querySelector(".result");
        if (!resultSpan) {
            resultSpan = document.createElement("span");
            resultSpan.className = "result";
            tc.elem.appendChild(resultSpan);
        }
        resultSpan.classList.remove("pass", "fail");
        const passed = checkTestCaseCorrectlyRedacted(tc);
        resultSpan.classList.add(passed ? "pass" : "fail");
        if (passed) {
            passedTests++;
        }
    });
    const totalTests = testCases.length;
    const passRate = (passedTests / totalTests) * 100;
    // Create and insert the 'testresults' element
    const resultsDiv = document.createElement("div");
    resultsDiv.className = "testresults";
    let statusIcon = "";
    if (passRate === 100) {
        statusIcon = "✅";
    }
    else if (passRate >= 70) {
        statusIcon = "⚠️";
    }
    else {
        statusIcon = "❌";
    }
    const passRateText = passRate.toFixed(1);
    const resultText = `${statusIcon} ${passedTests}/${totalTests} passed (${passRateText}%)`;
    console.log(resultText);
    resultsDiv.textContent = resultText;
    container.insertBefore(resultsDiv, container.firstChild);
}
export async function loadTestCasesFromFile(filePath, forceUpdate = true) {
    const response = await fetch(filePath);
    const testCases = await response.json();
    const container = document.querySelector(".testcases");
    // Clear existing test cases
    container.innerHTML = "";
    // Formatter functions for various card types
    const formatters = {
        Visa: [
            (cardNumber) => cardNumber, // No-op formatter
            (cardNumber) => cardNumber.replace(/(\d{4})(?=\d)/g, "$1-"), // ####-####-####-####
            (cardNumber) => cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "), // #### #### #### ####
        ],
        Mastercard: [
            (cardNumber) => cardNumber, // No-op formatter
            (cardNumber) => cardNumber.replace(/(\d{4})(?=\d)/g, "$1-"), // ####-####-####-####
            (cardNumber) => cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "), // #### #### #### ####
        ],
        "American Express": [
            (cardNumber) => cardNumber, // No-op formatter
            (cardNumber) => cardNumber.replace(/(\d{4})(\d{6})(\d{5})/, "$1-$2-$3"), // ####-######-#####
            (cardNumber) => cardNumber.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3"), // #### ###### #####
        ],
        Discover: [
            (cardNumber) => cardNumber, // No-op formatter
            (cardNumber) => cardNumber.replace(/(\d{4})(?=\d)/g, "$1-"), // ####-####-####-####
            (cardNumber) => cardNumber.replace(/(\d{4})(?=\d)/g, "$1 "), // #### #### #### ####
        ],
    };
    testCases.forEach((tc) => {
        const formattersForType = formatters[tc.cardType] || [(n) => n];
        formattersForType.forEach((formatter) => {
            const formattedCardNumber = formatter(tc.cardNumber);
            const div = document.createElement("div");
            div.className = `testcase ${tc.shouldBeValid ? "expectRedacted" : "expectClear"}`;
            div.textContent = `${formattedCardNumber} (${tc.cardType})`;
            container.appendChild(div);
        });
        // Add a blank line delimiter
        const blankLine = document.createElement("div");
        blankLine.style.height = "1em";
        container.appendChild(blankLine);
    });
    if (forceUpdate) {
        // Make a trivial update to force a modification to all testcase elements.
        Array.from(document.querySelectorAll("div.testcase")).forEach((e) => {
            let d = e;
            if (d?.innerText) {
                d.innerText = d.innerText + " ";
            }
        });
    }
}
