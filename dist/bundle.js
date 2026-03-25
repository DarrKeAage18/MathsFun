"use strict";
(() => {
  // src/operators/Operator.ts
  var Operator = class {
    rnd(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /** Returns a random number with exactly `digits` digits */
    nDigit(digits) {
      const min = Math.pow(10, digits - 1);
      const max = Math.pow(10, digits) - 1;
      return this.rnd(min, max);
    }
    generateSet(carryMode, digits) {
      const problems = [];
      if (carryMode === "with") {
        for (let i = 0; i < 10; i++) problems.push(this.make(true, digits));
      } else if (carryMode === "without") {
        for (let i = 0; i < 10; i++) problems.push(this.make(false, digits));
      } else {
        for (let i = 0; i < 5; i++) problems.push(this.make(true, digits));
        for (let i = 0; i < 5; i++) problems.push(this.make(false, digits));
      }
      for (let i = problems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [problems[i], problems[j]] = [problems[j], problems[i]];
      }
      return problems;
    }
  };

  // src/operators/Addition.ts
  var Addition = class extends Operator {
    constructor() {
      super(...arguments);
      this.symbol = "+";
    }
    make(withCarry, digits) {
      let a, b;
      let tries = 0;
      do {
        a = this.nDigit(digits);
        b = this.nDigit(digits);
        tries++;
        if (tries > 300) break;
      } while (withCarry ? a % 10 + b % 10 < 10 : a % 10 + b % 10 >= 10);
      return { a, b, op: this.symbol, answer: a + b, digits };
    }
  };

  // src/operators/Subtraction.ts
  var Subtraction = class extends Operator {
    constructor() {
      super(...arguments);
      this.symbol = "-";
    }
    make(withBorrow, digits) {
      let a, b;
      let tries = 0;
      do {
        a = this.nDigit(digits);
        b = this.nDigit(digits);
        tries++;
        if (tries > 300) break;
      } while (a <= b || withBorrow && a % 10 >= b % 10 || !withBorrow && a % 10 < b % 10);
      return { a, b, op: this.symbol, answer: a - b, digits };
    }
  };

  // src/background.ts
  var SYMBOLS = ["+", "-", "=", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "\xD7"];
  var COLOURS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#ff9ff3", "#54a0ff"];
  function buildBackground(layerId) {
    const layer = document.getElementById(layerId);
    if (!layer) return;
    for (let i = 0; i < 18; i++) {
      const b = document.createElement("div");
      b.className = "bubble";
      const size = 30 + Math.random() * 120;
      b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-${size}px;
      background:${COLOURS[i % COLOURS.length]};
      animation-duration:${8 + Math.random() * 14}s;
      animation-delay:-${Math.random() * 16}s;
    `;
      layer.appendChild(b);
    }
    for (let i = 0; i < 20; i++) {
      const s = document.createElement("div");
      s.className = "math-symbol";
      s.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      s.style.cssText = `
      left:${Math.random() * 100}%;
      bottom:-60px;
      animation-duration:${10 + Math.random() * 12}s;
      animation-delay:-${Math.random() * 20}s;
      color:rgba(255,255,255,0.07);
    `;
      layer.appendChild(s);
    }
  }

  // src/renderer.ts
  var ACCENTS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF"];
  function buildCarryRow(digits, idx) {
    const totalBoxes = digits + 1;
    const boxes = Array.from(
      { length: totalBoxes },
      (_, col) => `<input
      class="carry-input"
      type="text"
      inputmode="numeric"
      maxlength="1"
      aria-label="carry column ${totalBoxes - col}"
      data-problem="${idx}"
      data-col="${totalBoxes - 1 - col}"
    />`
    ).join("");
    return `<div class="carry-row">${boxes}</div>`;
  }
  function renderProblems(problems, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = "";
    const isAddition = problems.length > 0 && problems[0].op === "+";
    problems.forEach((p, idx) => {
      const accent = ACCENTS[idx % ACCENTS.length];
      const delay = idx * 60;
      const card = document.createElement("div");
      card.className = "problem-card";
      card.dataset.idx = String(idx);
      card.style.setProperty("--accent", accent);
      card.style.animationDelay = `${delay}ms`;
      const carryRowHtml = isAddition ? buildCarryRow(p.digits, idx) : "";
      card.innerHTML = `
      <div class="card-blob"></div>
      <div class="card-num">Problem ${idx + 1}</div>
      <span class="result-badge" id="badge-${idx}"></span>

      <div class="math-block">
        ${carryRowHtml}
        <div class="math-row">${p.a}</div>
        <div class="math-row op-row">
          <span class="op-sign">${p.op}</span>
          <span>${p.b}</span>
        </div>
        <hr class="dashed-sep" />
        <div class="answer-row">
          <input
            class="answer-input"
            type="number"
            id="ans-${idx}"
            placeholder="?"
            autocomplete="off"
          />
        </div>
        <div class="correct-answer" id="correct-${idx}">
          \u270F\uFE0F ${p.answer}
        </div>
      </div>
    `;
      grid.appendChild(card);
    });
    const first = document.getElementById("ans-0");
    if (first) first.focus();
    problems.forEach((_, idx) => {
      const inp = document.getElementById(`ans-${idx}`);
      if (!inp) return;
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const next = document.getElementById(`ans-${idx + 1}`);
          if (next) next.focus();
          else inp.blur();
        }
      });
    });
  }
  function showEmptyState(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <span class="empty-icon">\u{1F680}</span>
      Choose an operation and press <strong>Generate!</strong>
    </div>`;
  }

  // src/confetti.ts
  var CONFETTI_COLOURS = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF", "#ff9ff3", "#ffffff"];
  var SHAPES = ["50%", "0%"];
  function launchConfetti(layerId) {
    const layer = document.getElementById(layerId);
    if (!layer) return;
    for (let i = 0; i < 140; i++) {
      const cf = document.createElement("div");
      cf.className = "cf";
      cf.style.cssText = `
      left:${Math.random() * 100}%;
      top: 0;
      background:${CONFETTI_COLOURS[Math.floor(Math.random() * CONFETTI_COLOURS.length)]};
      border-radius:${SHAPES[Math.floor(Math.random() * SHAPES.length)]};
      width:${6 + Math.random() * 10}px;
      height:${6 + Math.random() * 10}px;
      animation-duration:${2.5 + Math.random() * 2.5}s;
      animation-delay:${Math.random() * 1.5}s;
    `;
      layer.appendChild(cf);
      cf.addEventListener("animationend", () => cf.remove());
    }
  }

  // src/main.ts
  var OPERATORS = {
    addition: new Addition(),
    subtraction: new Subtraction()
  };
  var currentProblems = [];
  function checkAnswers() {
    const total = currentProblems.length;
    let correct = 0;
    currentProblems.forEach((p, idx) => {
      const inp = document.getElementById(`ans-${idx}`);
      const card = document.querySelector(`.problem-card[data-idx="${idx}"]`);
      const badge = document.getElementById(`badge-${idx}`);
      if (!inp || !card || !badge) return;
      const val = inp.value.trim();
      const isCorrect = val !== "" && parseInt(val, 10) === p.answer;
      card.classList.add("checked");
      card.classList.remove("correct", "incorrect");
      if (isCorrect) {
        card.classList.add("correct");
        badge.textContent = "\u2705";
        correct++;
      } else {
        card.classList.add("incorrect");
        badge.textContent = "\u274C";
      }
    });
    const banner = document.getElementById("scoreBanner");
    const scoreText = document.getElementById("scoreText");
    if (!banner || !scoreText) return;
    banner.classList.add("visible");
    if (correct === total) {
      scoreText.innerHTML = `<span class="score-emoji">\u{1F389}\u{1F31F}\u{1F38A}</span>  Perfect Score! ${correct} / ${total}  <span class="score-emoji">\u{1F38A}\u{1F31F}\u{1F389}</span>`;
      launchConfetti("confetti-layer");
    } else if (correct >= total * 0.7) {
      scoreText.innerHTML = `<span class="score-emoji">\u{1F60A}</span>  Great job! ${correct} / ${total} correct!  <span class="score-emoji">\u2B50</span>`;
    } else {
      scoreText.innerHTML = `<span class="score-emoji">\u{1F4AA}</span>  Keep practising! ${correct} / ${total} correct.`;
    }
    document.getElementById("btnCheck")?.classList.remove("visible");
    document.getElementById("btnReset")?.classList.add("visible");
  }
  function resetAll() {
    showEmptyState("problemsGrid");
    document.getElementById("scoreBanner")?.classList.remove("visible");
    document.getElementById("btnCheck")?.classList.remove("visible");
    document.getElementById("btnReset")?.classList.remove("visible");
    currentProblems = [];
  }
  function init() {
    buildBackground("bgLayer");
    document.getElementById("btnGenerate")?.addEventListener("click", () => {
      const op = document.getElementById("opSelect").value;
      const carry = document.getElementById("carrySelect").value;
      const digits = parseInt(document.getElementById("digitsSelect").value, 10);
      const operator = OPERATORS[op];
      if (!operator) return;
      currentProblems = operator.generateSet(carry, digits);
      renderProblems(currentProblems, "problemsGrid");
      document.getElementById("scoreBanner")?.classList.remove("visible");
      document.getElementById("btnCheck")?.classList.add("visible");
      document.getElementById("btnReset")?.classList.remove("visible");
    });
    document.getElementById("btnCheck")?.addEventListener("click", checkAnswers);
    document.getElementById("btnReset")?.addEventListener("click", resetAll);
  }
  init();
})();
//# sourceMappingURL=bundle.js.map
