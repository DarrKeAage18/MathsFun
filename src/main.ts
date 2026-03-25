import { Problem, CarryMode, Operator } from './operators/Operator';
import { Addition } from './operators/Addition';
import { Subtraction } from './operators/Subtraction';
import { buildBackground } from './background';
import { renderProblems, showEmptyState } from './renderer';
import { launchConfetti } from './confetti';
import { getLevelConfig, MAX_LEVEL, LEVEL_UP_THRESHOLD } from './levels';
import { playerState } from './playerState';

const OPERATORS: Record<string, Operator> = {
  addition: new Addition(),
  subtraction: new Subtraction(),
};

let currentProblems: Problem[] = [];

function updateStatsUI(): void {
  const { name, points, level } = playerState.get();
  const el        = document.getElementById('playerNameDisplay');
  const ptsEl     = document.getElementById('pointsDisplay');
  const levelNumEl = document.getElementById('levelNum');
  const chipEl    = document.getElementById('levelChip');

  if (el)         el.textContent = name;
  if (ptsEl)      ptsEl.textContent = String(points);
  if (levelNumEl) levelNumEl.textContent = String(level);
  if (chipEl)     chipEl.textContent = level >= MAX_LEVEL ? `🏅 Max Level!` : `Level ${level}`;
}

function checkAnswers(): void {
  const total = currentProblems.length;
  let correct = 0;

  currentProblems.forEach((p, idx) => {
    const inp   = document.getElementById(`ans-${idx}`) as HTMLInputElement | null;
    const card  = document.querySelector<HTMLElement>(`.problem-card[data-idx="${idx}"]`);
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

  const { level } = playerState.get();
  const config = getLevelConfig(level);
  const earned = correct * config.pointsPerCorrect;
  playerState.addPoints(earned);

  let leveledUp = false;
  if (correct >= LEVEL_UP_THRESHOLD && level < MAX_LEVEL) {
    playerState.setLevel(level + 1);
    leveledUp = true;
  }

  updateStatsUI();

  const banner    = document.getElementById('scoreBanner');
  const scoreText = document.getElementById('scoreText');
  if (!banner || !scoreText) return;

  banner.classList.add('visible');

  let msg = '';
  if (correct === total) {
    msg = `<span class="score-emoji">🎉🌟🎊</span> Perfect Score! ${correct} / ${total} <span class="score-emoji">🎊🌟🎉</span>`;
    launchConfetti('confetti-layer');
  } else if (correct >= total * 0.7) {
    msg = `<span class="score-emoji">😊</span> Great job! ${correct} / ${total} correct! <span class="score-emoji">⭐</span>`;
  } else {
    msg = `<span class="score-emoji">💪</span> Keep practising! ${correct} / ${total} correct.`;
  }

  msg += `<br><span class="score-points">+${earned} points 🏆</span>`;

  if (leveledUp) {
    const newLevel = level + 1;
    const newConfig = getLevelConfig(newLevel);
    msg += `<br><span class="score-levelup">🚀 Level Up! Now Level ${newLevel} — ${newConfig.label}!</span>`;
    launchConfetti('confetti-layer');
  }

  scoreText.innerHTML = msg;
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

function showNameModal(): void {
  const modal = document.getElementById('nameModal');
  if (modal) modal.classList.add('visible');
  (document.getElementById('nameInput') as HTMLInputElement | null)?.focus();
}

function submitName(): void {
  const input = document.getElementById('nameInput') as HTMLInputElement | null;
  const name = input?.value.trim() ?? '';
  if (!name) return;
  playerState.setName(name);
  document.getElementById('nameModal')?.classList.remove('visible');
  updateStatsUI();
}

function init(): void {
  buildBackground('bgLayer');
  updateStatsUI();

  if (!playerState.get().name) {
    showNameModal();
  }

  document.getElementById('btnStartGame')?.addEventListener('click', submitName);

  (document.getElementById('nameInput') as HTMLInputElement | null)
    ?.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') submitName();
    });

  document.getElementById('btnGenerate')?.addEventListener('click', () => {
    const { level } = playerState.get();
    const config = getLevelConfig(level);

    const op    = (document.getElementById('opSelect') as HTMLSelectElement).value;
    const carry = (document.getElementById('carrySelect') as HTMLSelectElement).value as CarryMode;
    const operator = OPERATORS[op];
    if (!operator) return;

    currentProblems = operator.generateSet(carry, config.digits);
    renderProblems(currentProblems, 'problemsGrid');
    document.getElementById('scoreBanner')?.classList.remove('visible');
    document.getElementById('btnCheck')?.classList.add('visible');
    document.getElementById('btnReset')?.classList.remove('visible');
  });

  document.getElementById('btnCheck')?.addEventListener('click', checkAnswers);
  document.getElementById('btnReset')?.addEventListener('click', resetAll);
}

init();
