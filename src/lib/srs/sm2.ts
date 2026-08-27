// Algoritmo SM-2 (SuperMemo 2) — motor de repetição espaçada real.
// Referência: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
// quality: 0-5 (0-2 = falhou/esqueceu, 3-5 = acertou com confiança crescente).
// Simplificamos a UI para "Errei"(1) / "Difícil"(3) / "Fácil"(5) — ver ReviewRunner.

export interface Sm2State {
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
}

export interface Sm2Result extends Sm2State {
  dueAt: Date;
}

export function sm2Next(state: Sm2State, quality: number, now: Date = new Date()): Sm2Result {
  const q = Math.max(0, Math.min(5, quality));

  if (q < 3) {
    // Falhou: reinicia a progressão, mas mantém o ease factor (não é punitivo além disto).
    return {
      intervalDays: 1,
      easeFactor: state.easeFactor,
      repetitions: 0,
      dueAt: addDays(now, 1),
    };
  }

  const repetitions = state.repetitions + 1;
  let intervalDays: number;
  if (repetitions === 1) intervalDays = 1;
  else if (repetitions === 2) intervalDays = 6;
  else intervalDays = Math.round(state.intervalDays * state.easeFactor);

  const easeFactor = Math.max(
    1.3,
    state.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  return { intervalDays, easeFactor, repetitions, dueAt: addDays(now, intervalDays) };
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}
