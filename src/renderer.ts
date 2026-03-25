import { Problem } from './operators/Operator';

const ACCENTS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#C77DFF'];

/**
 * Build a row of carry input boxes — one small box per digit column,
 * plus one extra on the left to capture a final carry-out.
 * Used for addition only.
 */
function buildCarryRow(digits: number, idx: number): string {
  const totalBoxes = digits + 1; // overflow carry + one per digit column
  const boxes = Array.from({ length: totalBoxes }, (_, col) =>
    `<input
      class="carry-input"
      type="text"
      inputmode="numeric"
      maxlength="1"
      aria-label="carry column ${totalBoxes - col}"
      data-problem="${idx}"
      data-col="${totalBoxes - 1 - col}"
    />`
  ).join('');
  return `<div class="carry-row">${boxes}</div>`;
}

export function renderProblems(problems: Problem[], gridId: string): void {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = '';

  const isAddition = problems.length > 0 && problems[0].op === '+';

  problems.forEach((p, idx) => {
    const accent = ACCENTS[idx % ACCENTS.length];
    const delay = idx * 60;

    const card = document.createElement('div');
    card.className = 'problem-card';
    card.dataset.idx = String(idx);
    card.style.setProperty('--accent', accent);
    card.style.animationDelay = `${delay}ms`;

    const carryRowHtml = isAddition ? buildCarryRow(p.digits, idx) : '';

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
          ✏️ ${p.answer}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  const first = document.getElementById('ans-0') as HTMLInputElement | null;
  if (first) first.focus();

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
