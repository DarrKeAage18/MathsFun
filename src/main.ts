import { Problem, CarryMode, Operator } from './operators/Operator';
import { Addition } from './operators/Addition';
import { Subtraction } from './operators/Subtraction';
import { buildBackground } from './background';
import { renderProblems, showEmptyState } from './renderer';
import { launchConfetti } from './confetti';

const OPERATORS: Record<string, Operator> = {
  addition: new Addition(),
  subtraction: new Subtraction(),
};

let currentProblems: Problem[] = [];

function checkAnswers(): void {
  const total = currentProblems.length;
  let correct = 0;

  currentProblems.forEach((p, idx) => {
    const inp  = document.getElementById(`ans-${idx}`) as HTMLInputElement | null;
    const card = document.querySelector<HTMLElement>(`.problem-card[data-idx="${idx}"]`);
    const badge = document.getElementById(`badge-${idx}`);
    if (!inp || !card || !badge) return;

    const val = inp.value.trim();
    const isCorrect = val !== '' && parseInt(val, 10) === p.answer;

    card.classList.add('checked');
    card.classList.remove('correct', 'incorrect');

    if (isCorrect) {
      card.classList.add('correct');
      badge.textContent = '✅';
      correct++;
    } else {
      card.classList.add('incorrect');
      badge.textContent = '❌';
    }
  });

  const banner    = document.getElementById('scoreBanner');
  const scoreText = document.getElementById('scoreText');
  if (!banner || !scoreText) return;

  banner.classList.add('visible');

  if (correct === total) {
    scoreText.innerHTML = `<span class="score-emoji">🎉🌟🎊</span>  Perfect Score! ${correct} / ${total}  <span class="score-emoji">🎊🌟🎉</span>`;
    launchConfetti('confetti-layer');
  } else if (correct >= total * 0.7) {
    scoreText.innerHTML = `<span class="score-emoji">😊</span>  Great job! ${correct} / ${total} correct!  <span class="score-emoji">⭐</span>`;
  } else {
    scoreText.innerHTML = `<span class="score-emoji">💪</span>  Keep practising! ${correct} / ${total} correct.`;
  }

  document.getElementById('btnCheck')?.classList.remove('visible');
  document.getElementById('btnReset')?.classList.add('visible');
}

function resetAll(): void {
  showEmptyState('problemsGrid');
  document.getElementById('scoreBanner')?.classList.remove('visible');
  document.getElementById('btnCheck')?.classList.remove('visible');
  document.getElementById('btnReset')?.classList.remove('visible');
  currentProblems = [];
}

function init(): void {
  buildBackground('bgLayer');

  document.getElementById('btnGenerate')?.addEventListener('click', () => {
    const op     = (document.getElementById('opSelect') as HTMLSelectElement).value;
    const carry  = (document.getElementById('carrySelect') as HTMLSelectElement).value as CarryMode;
    const digits = parseInt((document.getElementById('digitsSelect') as HTMLSelectElement).value, 10);
    const operator = OPERATORS[op];
    if (!operator) return;

    currentProblems = operator.generateSet(carry, digits);
    renderProblems(currentProblems, 'problemsGrid');
    document.getElementById('scoreBanner')?.classList.remove('visible');
    document.getElementById('btnCheck')?.classList.add('visible');
    document.getElementById('btnReset')?.classList.remove('visible');
  });

  document.getElementById('btnCheck')?.addEventListener('click', checkAnswers);
  document.getElementById('btnReset')?.addEventListener('click', resetAll);
}

init();
