import type { TestCase } from "./types.js";

export function checkTestCaseCorrectlyRedacted(tc: {
  elem: HTMLElement;
  redacted: boolean;
}) {
  const isRedacted = tc.redacted;
  const expectRedacted = tc.elem.classList.contains("expectRedacted");
  return isRedacted === expectRedacted;
}

export function checkForRedacted() {
  const testCases = Array.from(document.querySelectorAll(".testcase")).map(
    (e) => ({
      elem: e as HTMLElement,
      text: e.textContent || "",
      redacted: (e.textContent || "").includes("█"),
    })
  );

  testCases.forEach((tc) => {
    let resultSpan = tc.elem.querySelector(".result") as HTMLElement;
    if (!resultSpan) {
      resultSpan = document.createElement("span");
      resultSpan.className = "result";
      tc.elem.appendChild(resultSpan);
    }

    resultSpan.classList.remove("pass", "fail");
    const passed = checkTestCaseCorrectlyRedacted(tc);
    resultSpan.classList.add(passed ? "pass" : "fail");
  });
}

export async function loadTestCasesFromFile(
  filePath: string,
  forceUpdate: boolean = true
) {
  const response = await fetch(filePath);
  const testCases: TestCase[] = await response.json();
  const container = document.querySelector(".testcases") as HTMLElement;

  // Clear existing test cases
  container.innerHTML = "";

  testCases.forEach(
    (tc: { cardType: string; cardNumber: string; shouldBeValid: boolean }) => {
      const div = document.createElement("div");
      //  When the CC number is valid, it should be redacted
      div.className = `testcase ${
        tc.shouldBeValid ? "expectRedacted" : "expectClear"
      }`;
      div.textContent = tc.cardNumber;
      container.appendChild(div);
    }
  );

  if (forceUpdate) {
    // Make a trivial update to force a modification to all testcase elements.
    Array.from(document.querySelectorAll("div.testcase")).forEach(
      (e: Element): void => {
        let d = e as HTMLDivElement;
        if (d?.innerText) {
          d.innerText = d.innerText + " ";
        }
      }
    );
  }
}
