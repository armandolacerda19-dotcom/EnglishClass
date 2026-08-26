"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { saveOnboardingBasics, type OnboardingBasics } from "@/app/onboarding/actions";

const GOALS: { value: OnboardingBasics["goal"]; label: string }[] = [
  { value: "TRAVEL", label: "Viajar com confiança" },
  { value: "WORK", label: "Trabalhar em inglês no dia a dia" },
  { value: "INTERVIEW", label: "Preparar uma entrevista" },
  { value: "PROMOTION", label: "Preparar uma promoção" },
  { value: "RELOCATION", label: "Mudar de país" },
  { value: "MEETINGS", label: "Reuniões e apresentações" },
  { value: "EXAM", label: "Preparar um exame" },
  { value: "GENERAL", label: "Melhorar de forma geral" },
];

const TIME_OPTIONS = [
  { minutes: 5, label: "5 min — Minimum Habit" },
  { minutes: 15, label: "15 min — Standard" },
  { minutes: 30, label: "30 min — Accelerated" },
  { minutes: 45, label: "45 min — High Commitment" },
];

const INTENSIVE_TIME_OPTIONS = [
  { minutes: 30, label: "30 min — Intensive Light" },
  { minutes: 60, label: "60 min — Intensive" },
  { minutes: 90, label: "90 min — Intensive Pro" },
  { minutes: 120, label: "120+ min — Immersion" },
];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<OnboardingBasics["goal"]>("GENERAL");
  const [track, setTrack] = useState<OnboardingBasics["track"]>("STANDARD");
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [profession, setProfession] = useState("");
  const [interests, setInterests] = useState("");
  const [variant, setVariant] = useState<OnboardingBasics["englishVariant"]>("INTERNATIONAL");
  const [targetDate, setTargetDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const timeOptions = track === "INTENSIVE" ? INTENSIVE_TIME_OPTIONS : TIME_OPTIONS;

  async function handleSubmit() {
    setSubmitting(true);
    await saveOnboardingBasics({
      goal,
      dailyMinutes,
      profession,
      interests: interests
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      englishVariant: variant,
      track,
      targetDate: track === "INTENSIVE" && targetDate ? targetDate : null,
    });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-verdigris">Passo {step + 1} de 4</p>

      {step === 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-display text-xl">Qual é o seu objetivo?</legend>
          {GOALS.map((g) => (
            <label key={g.value} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input type="radio" name="goal" checked={goal === g.value} onChange={() => setGoal(g.value)} />
              {g.label}
            </label>
          ))}
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-2 font-display text-xl">Standard ou Intensive?</legend>
          <label className="flex items-start gap-2 rounded-control border border-ink/10 p-3 text-sm">
            <input type="radio" name="track" checked={track === "STANDARD"} onChange={() => setTrack("STANDARD")} />
            <span>
              <strong>Standard</strong> — consistência e retenção, sessões curtas.
            </span>
          </label>
          <label className="flex items-start gap-2 rounded-control border border-ink/10 p-3 text-sm">
            <input type="radio" name="track" checked={track === "INTENSIVE"} onChange={() => setTrack("INTENSIVE")} />
            <span>
              <strong>Intensive</strong> — plano acelerado com prazo, mais exposição diária.
            </span>
          </label>

          {track === "INTENSIVE" && (
            <label className="flex flex-col gap-1 text-sm">
              Data-alvo
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="rounded-control border border-ink/20 px-3 py-2"
              />
            </label>
          )}

          <p className="mt-2 font-display text-lg">Quanto tempo tem por dia?</p>
          {timeOptions.map((t) => (
            <label key={t.minutes} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input type="radio" name="time" checked={dailyMinutes === t.minutes} onChange={() => setDailyMinutes(t.minutes)} />
              {t.label}
            </label>
          ))}
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-2 font-display text-xl">Fale-nos de si</legend>
          <label className="flex flex-col gap-1 text-sm">
            Profissão
            <input value={profession} onChange={(e) => setProfession(e.target.value)} className="rounded-control border border-ink/20 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Interesses (separados por vírgula)
            <input value={interests} onChange={(e) => setInterests(e.target.value)} className="rounded-control border border-ink/20 px-3 py-2" />
          </label>
          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm">Variante de inglês</legend>
            {(["INTERNATIONAL", "BRITISH", "AMERICAN"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 text-sm">
                <input type="radio" name="variant" checked={variant === v} onChange={() => setVariant(v)} />
                {v === "INTERNATIONAL" ? "International English" : v === "BRITISH" ? "British" : "American"}
              </label>
            ))}
          </fieldset>
        </fieldset>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-xl">Pronto para o placement test</h2>
          <p className="text-sm text-inkNeutral/80 dark:text-linen/80">
            Vamos avaliar os 8 pilares (grammar, vocabulary, listening, speaking, pronunciation, reading, writing,
            translation) para desenhar o seu plano. Demora cerca de 15 minutos.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Voltar
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            Continuar
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? "A guardar..." : "Iniciar placement test"}
          </Button>
        )}
      </div>
    </div>
  );
}
