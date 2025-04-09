export function checkTestCaseCorrectlyRedacted(tc) {
    const isRedacted = tc.redacted;
    const expectRedacted = tc.elem.classList.contains('expectRedacted');
    return isRedacted === expectRedacted;
}
export function checkForRedacted() {
    const testCases = Array.from(document.querySelectorAll('.testcase')).map(e => ({
        elem: e,
        text: e.textContent || '',
        redacted: (e.textContent || '').includes('█'),
    }));
    testCases.forEach(tc => {
        let resultSpan = tc.elem.querySelector('.result');
        if (!resultSpan) {
            resultSpan = document.createElement('span');
            resultSpan.className = 'result';
            tc.elem.appendChild(resultSpan);
        }
        resultSpan.classList.remove('pass', 'fail');
        const passed = checkTestCaseCorrectlyRedacted(tc);
        resultSpan.classList.add(passed ? 'pass' : 'fail');
    });
}
export async function loadTestCasesFromFile(filePath) {
    const response = await fetch(filePath);
    const testCases = await response.json();
    const container = document.querySelector('.testcases');
    // Clear existing test cases
    container.innerHTML = '';
    testCases.forEach((tc) => {
        const div = document.createElement('div');
        div.className = `testcase ${tc.shouldBeValid ? 'expectClear' : 'expectRedacted'}`;
        div.textContent = tc.cardNumber;
        container.appendChild(div);
    });
}
