import { Problem } from './operators/Operator';

const ACCENTS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF'];

/**
 * Renders the problem as a flat CSS-grid where every cell — carry inputs,
 * digit spans, separator, answer — is a direct child of the grid.
 * This guarantees each carry box sits exactly above its digit column.
 *
 * Grid layout (example: 2-digit addition, totalCols = 3):
 *   col:  0(overflow)  1(tens)  2(ones)
 *   row0: [carry]      [carry]  [carry]   ← addition only
 *   row1: [  ]         [4]      [7]       ← number a
 *   row2: [+]          [3]      [8]       ← op + number b
 *   row3: <separator — spans all cols>
 *   row4: <answer input — spans all cols>
 */
function buildMathGrid(p: Problem, idx: number): string {
  const totalCols = p.digits + 1; // overflow carry column + one per digit
  const isAddition = p.op === '+';

  // Split numbers into individual digit characters (always exactly p.digits long)
  const aDigits = String(p.a).padStart(p.digits, ' ').split('');
  const bDigits = String(p.b).padStart(p.digits, ' ').split('');

  let cells = '';

  // ── Carry row (addition only) ──────────────────────────────────
  if (isAddition) {
    for (let col = 0; col < totalCols; col++) {
      cells += `<input class="carry-input" type="text" inputmode="numeric" maxlength="1"
        aria-label="carry col ${col}" data-problem="${idx}" data-col="${totalCols - 1 - col}" />`;
    }
  }

  // ── Number A row: blank overflow cell + each digit ─────────────
  cells += `<span class="digit-cell"></span>`;
  for (const d of aDigits) {
    cells += `<span class="digit-cell">${d.trim()}</span>`;
  }

  // ── Op + B row: op sign in overflow cell + each digit ─────────
  cells += `<span class="digit-cell op-sign">${p.op}</span>`;
  for (const d of bDigits) {
    cells += `<span class="digit-cell">${d.trim()}</span>`;
  }

  // ── Separator (spans all columns) ─────────────────────────────
  cells += `<hr class="dashed-sep math-grid-full" />`;

  // ── Answer input (spans all columns) ──────────────────────────
  cells += `<div class="answer-row math-grid-full">
    <input class="answer-input" type="number" id="ans-${idx}"
      placeholder="?" autocomplete="off" />
  </div>`;

  // ── Correct answer reveal (spans all columns) ─────────────────
  cells += `<div class="correct-answer math-grid-full" id="correct-${idx}">✏️ ${p.answer}</div>`;

  return `<div class="math-grid" style="--math-cols:${totalCols}">${cells}</div>`;
}

export function renderProblems(problems: Problem[], gridId: string): void {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';

  problems.forEach((p, idx) => {
    const accent = ACCENTS[idx % ACCENTS.length];

    const card = document.createElement('div');
    card.className = 'problem-card';
    card.dataset.idx = String(idx);
    card.style.setProperty('--accent', accent);
    card.style.animationDelay = `${idx * 60}ms`;

    card.innerHTML = `
      <div class="card-blob"></div>
      <div class="card-num">Problem ${idx + 1}</div>
      <span class="result-badge" id="badge-${idx}"></span>
      ${buildMathGrid(p, idx)}
    `;

    grid.appendChild(card);
  });

  (document.getElementById('ans-0') as HTMLInputElement | null)?.focus();

  problems.forEach((_, idx) => {
    const inp = document.getElementById(`ans-${idx}`) as HTMLInputElement | null;
    if (!inp) return;
    inp.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const next = document.getElementById(`ans-${idx + 1}`) as HTMLInputElement | null;
        if (next) next.focus();
        else inp.blur();
      }
    });
  });
}

export function showEmptyState(gridId: string): void {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = `
    <div class="empty-state" style="grid-column:1/-1">
      <span class="empty-icon">🚀</span>
      Choose an operation and press <strong>Generate!</strong>
    </div>`;
}
