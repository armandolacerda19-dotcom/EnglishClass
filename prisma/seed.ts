import { PrismaClient, Pillar } from "@prisma/client";
import levelsData from "../content/curriculum/levels.json";
import moduleDailyLife from "../content/curriculum/a1-module-01-daily-life.json";
import moduleFirstWords from "../content/curriculum/pre-a1-module-01-first-words.json";
import moduleAboutMe from "../content/curriculum/a1-module-02-about-me.json";
import moduleShopping from "../content/curriculum/a1-module-03-shopping.json";
import moduleComparatives from "../content/curriculum/a1-module-04-comparatives.json";
import moduleRestaurant from "../content/curriculum/a1-module-05-restaurant.json";
import modulePastSimple from "../content/curriculum/a1-module-06-past-simple.json";
import moduleFuturePlans from "../content/curriculum/a1-module-07-future-plans.json";
import moduleExperiences from "../content/curriculum/a2-module-01-experiences.json";
import moduleObligation from "../content/curriculum/a2-module-02-obligation.json";
import moduleFirstConditional from "../content/curriculum/a2-module-03-first-conditional.json";
import modulePresentContinuous from "../content/curriculum/a1-module-08-present-continuous.json";
import modulePronouns from "../content/curriculum/a1-module-09-pronouns.json";
import moduleArticles from "../content/curriculum/a1-module-10-articles.json";
import moduleSuperlatives from "../content/curriculum/a1-module-11-superlatives.json";
import moduleQuantifiers from "../content/curriculum/a1-module-12-quantifiers.json";
import moduleWhQuestions from "../content/curriculum/a1-module-13-wh-questions.json";
import moduleFutureWill from "../content/curriculum/a1-module-14-future-will.json";
import modulePastContinuous from "../content/curriculum/a2-module-04-past-continuous.json";
import moduleRelativeClauses from "../content/curriculum/a2-module-05-relative-clauses.json";
import moduleGerundsInfinitives from "../content/curriculum/a2-module-06-gerunds-infinitives.json";
import moduleQuestionTags from "../content/curriculum/a2-module-07-question-tags.json";
import modulePastPerfect from "../content/curriculum/b1-module-01-past-perfect.json";
import moduleSecondConditional from "../content/curriculum/b1-module-02-second-conditional.json";
import modulePassiveVoice from "../content/curriculum/b1-module-03-passive-voice.json";
import moduleReportedSpeech from "../content/curriculum/b1-module-04-reported-speech.json";
import moduleFutureContinuous from "../content/curriculum/b1-module-05-future-continuous.json";
import moduleUsedTo from "../content/curriculum/b1-module-06-used-to.json";
import moduleModalsDeduction from "../content/curriculum/b1-module-07-modals-deduction.json";
import moduleThirdConditional from "../content/curriculum/b1-module-08-third-conditional.json";
import moduleNumbersTime from "../content/curriculum/pre-a1-module-02-numbers-time.json";
import moduleModalsAbility from "../content/curriculum/a2-module-08-modals-ability.json";
import modulePhrasalVerbs from "../content/curriculum/a2-module-09-phrasal-verbs.json";
import moduleZeroConditional from "../content/curriculum/a2-module-10-zero-conditional.json";
import modulePresentPerfectVsPastSimple from "../content/curriculum/a2-module-11-present-perfect-vs-past-simple.json";
import vocabularyBank from "../content/curriculum/vocabulary-bank.json";
import vocabularyBank2 from "../content/curriculum/vocabulary-bank-2.json";
import vocabularyBank3 from "../content/curriculum/vocabulary-bank-3.json";
import vocabularyBank4 from "../content/curriculum/vocabulary-bank-4.json";
import vocabularyBank5 from "../content/curriculum/vocabulary-bank-5.json";
import vocabularyBank6 from "../content/curriculum/vocabulary-bank-6.json";
import vocabularyBank7 from "../content/curriculum/vocabulary-bank-7.json";
import vocabularyBank8 from "../content/curriculum/vocabulary-bank-8.json";
import vocabularyBank9 from "../content/curriculum/vocabulary-bank-9.json";
import vocabularyBank10 from "../content/curriculum/vocabulary-bank-10.json";
import vocabularyBank11 from "../content/curriculum/vocabulary-bank-11.json";
import vocabularyBank12 from "../content/curriculum/vocabulary-bank-12.json";
import vocabularyBank13 from "../content/curriculum/vocabulary-bank-13.json";
import vocabularyBank14 from "../content/curriculum/vocabulary-bank-14.json";
import vocabularyBank15 from "../content/curriculum/vocabulary-bank-15.json";
import vocabularyBank16 from "../content/curriculum/vocabulary-bank-16.json";
import vocabularyBank17 from "../content/curriculum/vocabulary-bank-17.json";
import vocabularyBank18 from "../content/curriculum/vocabulary-bank-18.json";
import vocabularyBank19 from "../content/curriculum/vocabulary-bank-19.json";

const prisma = new PrismaClient();

// Fase 13/achado N6 (auditoria 2026-08-27): o seed corre a CADA deploy
// (netlify.toml) e era ~2.400 upserts 100% sequenciais (30 módulos + 2.000+
// palavras de vocabulário standalone) — risco real de build lento ou com
// timeout, que só cresce à medida que o currículo cresce (35 módulos e a
// contar, depois deste lote). Upserts de itens independentes entre si (sem
// FK uns dos outros) não precisam de correr um de cada vez — só corridas
// concorrentes DEMASIADO grandes arriscam esgotar o pool de ligações do
// Postgres, por isso corre em lotes de `concurrency`, não tudo de uma vez.
async function mapWithConcurrency<T>(items: T[], concurrency: number, fn: (item: T) => Promise<unknown>) {
  for (let i = 0; i < items.length; i += concurrency) {
    await Promise.all(items.slice(i, i + concurrency).map(fn));
  }
}

// Cada ficheiro em content/curriculum/ segue o formato de docs/08-schema-json-conteudo.md:
// um módulo com uma unidade, um conceito de gramática, vocabulário, exercícios e uma lição.
// Adicionar conteúdo novo = adicionar um ficheiro aqui, sem tocar na lógica de seed abaixo.
// A ordem aqui decide Lesson.order (o índice + 1, ver main() abaixo), que por
// sua vez decide a sequência que getNextLessonForUser() segue. Os módulos
// novos (Fase 3 da auditoria, 2026-08-26 — gramática em falta) foram inseridos
// logo a seguir ao módulo A1/A2 da mesma sublevel_code a que pertencem, para
// que um utilizador a meio do currículo os encontre no sítio pedagogicamente
// certo, e não todos amontoados no fim.
const MODULE_FILES = [
  moduleFirstWords,
  moduleNumbersTime, // Pre-A1 — reforço de densidade (auditoria 2026-08-27, Fase 13: Pre-A1 tinha só 1 módulo)
  moduleDailyLife,
  moduleAboutMe,
  modulePresentContinuous, // A1.1 — depois de about-me
  modulePronouns, // A1.1
  moduleWhQuestions, // A1.1
  moduleShopping,
  moduleRestaurant,
  moduleArticles, // A1.2
  moduleQuantifiers, // A1.2
  moduleComparatives,
  moduleSuperlatives, // A1.3 — logo a seguir a comparatives
  modulePastSimple,
  moduleFuturePlans,
  moduleFutureWill, // A1.3 — logo a seguir a future-plans (going to vs. will)
  moduleExperiences,
  moduleObligation,
  moduleModalsAbility, // A2.1 — logo a seguir a obligation (must/have to → can/could/be able to), reforço de densidade (Fase 13, 2026-08-27)
  modulePastContinuous, // A2.1
  moduleGerundsInfinitives, // A2.1
  moduleQuestionTags, // A2.1
  moduleZeroConditional, // A2.1 — logo antes de first-conditional (0→1→2→3, mais simples primeiro), gap encontrado na Fase 13 (2026-08-27): only 1st/2nd/3rd existiam
  moduleFirstConditional,
  moduleRelativeClauses, // A2.2 — logo a seguir a first-conditional
  modulePhrasalVerbs, // A2.2, achado explícito da auditoria ("módulo de phrasal verbs" em falta), Fase 13, 2026-08-27
  modulePresentPerfectVsPastSimple, // A2.2 — último módulo A2, gap real: existia Present Perfect (experiences) e Past Simple isolados, mas nunca a distinção entre os dois, um dos pontos mais confusos para falantes de português (Fase 13, 2026-08-27)
  modulePastPerfect, // B1.1 — primeiro módulo do novo nível B1
  moduleSecondConditional, // B1.1
  modulePassiveVoice, // B1.1
  moduleUsedTo, // B1.1 — 4º módulo, reforço de densidade B1 (2026-08-27)
  moduleReportedSpeech, // B1.2
  moduleFutureContinuous, // B1.2
  moduleModalsDeduction, // B1.2 — reforço de densidade B1 (2026-08-27)
  moduleThirdConditional, // B1.2 — reforço de densidade B1 (2026-08-27)
];

async function seedLevels() {
  for (const level of levelsData.levels) {
    const dbLevel = await prisma.level.upsert({
      where: { cefr: level.cefr as any },
      update: { title: level.title, description: level.description, order: level.order },
      create: {
        cefr: level.cefr as any,
        order: level.order,
        title: level.title,
        description: level.description,
      },
    });

    for (const sub of level.sublevels) {
      await prisma.sublevel.upsert({
        where: { code: sub.code },
        update: { number: sub.number, order: sub.order, levelId: dbLevel.id },
        create: {
          number: sub.number,
          code: sub.code,
          order: sub.order,
          levelId: dbLevel.id,
        },
      });
    }
  }
}

async function seedModuleFile(data: (typeof MODULE_FILES)[number], lessonOrder: number) {
  const sublevel = await prisma.sublevel.findUniqueOrThrow({
    where: { code: data.sublevel_code },
  });

  const dbModule = await prisma.module.upsert({
    where: { id: data.module.id },
    update: { title: data.module.title, theme: data.module.theme, order: data.module.order, sublevelId: sublevel.id },
    create: {
      id: data.module.id,
      title: data.module.title,
      theme: data.module.theme,
      order: data.module.order,
      sublevelId: sublevel.id,
    },
  });

  const dbUnit = await prisma.unit.upsert({
    where: { id: data.unit.id },
    update: { title: data.unit.title, order: data.unit.order, skippable: data.unit.skippable, moduleId: dbModule.id },
    create: {
      id: data.unit.id,
      title: data.unit.title,
      order: data.unit.order,
      skippable: data.unit.skippable,
      moduleId: dbModule.id,
    },
  });

  const gc = data.grammar_concept;
  const dbConcept = await prisma.grammarConcept.upsert({
    where: { id: gc.id },
    update: {
      title: gc.title,
      rule: gc.rule,
      simpleExplanation: gc.simple_explanation,
      example: gc.example,
      exampleTranslation: gc.example_translation,
      commonMistakePt: gc.common_mistake_pt,
      correction: gc.correction,
      realWorldExample: gc.real_world_example,
      unitId: dbUnit.id,
    },
    create: {
      id: gc.id,
      title: gc.title,
      rule: gc.rule,
      simpleExplanation: gc.simple_explanation,
      example: gc.example,
      exampleTranslation: gc.example_translation,
      commonMistakePt: gc.common_mistake_pt,
      correction: gc.correction,
      realWorldExample: gc.real_world_example,
      unitId: dbUnit.id,
    },
  });

  for (const v of data.vocabulary) {
    await prisma.vocabularyItem.upsert({
      where: { id: v.id },
      update: {
        headword: v.headword,
        translationPt: v.translation_pt,
        definitionEn: v.definition_en,
        cefr: v.cefr_level as any,
        audioUrl: v.audio_url,
        ipa: v.ipa,
        collocations: v.related_forms,
        exampleSentences: v.example_sentences,
        difficulty: v.difficulty,
      },
      create: {
        id: v.id,
        headword: v.headword,
        translationPt: v.translation_pt,
        definitionEn: v.definition_en,
        cefr: v.cefr_level as any,
        audioUrl: v.audio_url,
        ipa: v.ipa,
        collocations: v.related_forms,
        exampleSentences: v.example_sentences,
        difficulty: v.difficulty,
      },
    });
  }

  const dbLesson = await prisma.lesson.upsert({
    where: { id: data.lesson.id },
    update: {
      title: data.lesson.title,
      pillars: data.lesson.pillars.map((p) => p.toUpperCase()) as Pillar[],
      order: lessonOrder,
      contentJson: data.lesson as any,
      unitId: dbUnit.id,
    },
    create: {
      id: data.lesson.id,
      title: data.lesson.title,
      pillars: data.lesson.pillars.map((p) => p.toUpperCase()) as Pillar[],
      order: lessonOrder,
      contentJson: data.lesson as any,
      unitId: dbUnit.id,
    },
  });

  for (const ex of data.exercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: {
        pillar: ex.pillar.toUpperCase() as Pillar,
        cefr: ex.cefr_level as any,
        contentJson: ex as any,
        generatedByAi: ex.generated_by_ai,
        qaApproved: ex.qa_status === "approved",
        lessonId: dbLesson.id,
        grammarConceptId: ex.concept_ref ?? undefined,
      },
      create: {
        id: ex.id,
        pillar: ex.pillar.toUpperCase() as Pillar,
        cefr: ex.cefr_level as any,
        contentJson: ex as any,
        generatedByAi: ex.generated_by_ai,
        qaApproved: ex.qa_status === "approved",
        lessonId: dbLesson.id,
        grammarConceptId: ex.concept_ref ?? undefined,
      },
    });
  }

  console.log(`Seeded "${dbModule.title}" (${sublevel.code}) → "${dbUnit.title}" → "${dbLesson.title}" (concept: ${dbConcept.title})`);
}

// Conquistas MVP1 — gamificação simples (XP/streak já corridos por src/lib/gamification/recordActivity.ts),
// esta tabela cobre marcos discretos em vez de progresso contínuo.
const ACHIEVEMENTS = [
  {
    code: "first_lesson_complete",
    title: "Primeira Lição",
    description: "Completou a sua primeira lição na plataforma.",
  },
  {
    code: "first_daily_challenge",
    title: "Primeiro Desafio",
    description: "Completou o seu primeiro Desafio Diário de vocabulário.",
  },
  {
    code: "first_review",
    title: "Primeira Revisão",
    description: "Completou a sua primeira sessão de revisão espaçada.",
  },
  {
    code: "streak_3",
    title: "Três Seguidos",
    description: "Praticou 3 dias seguidos.",
  },
  {
    code: "streak_7",
    title: "Semana Completa",
    description: "Praticou 7 dias seguidos.",
  },
  {
    code: "streak_30",
    title: "Hábito Feito",
    description: "Praticou 30 dias seguidos.",
  },
  {
    code: "first_weekly_test",
    title: "Primeiro Diagnóstico",
    description: "Completou o seu primeiro Diagnóstico Semanal.",
  },
  {
    code: "first_reading_passage",
    title: "Primeira Leitura",
    description: "Completou o seu primeiro texto de leitura extensiva.",
  },
  {
    code: "first_tutor_conversation",
    title: "Primeira Conversa",
    description: "Trocou a primeira mensagem com o AI Tutor.",
  },
  {
    code: "first_idiom",
    title: "Primeiro Idioma",
    description: "Aprendeu o seu primeiro idioma/phrasal verb do dia.",
  },
  {
    code: "first_certificate",
    title: "Primeiro Certificado",
    description: "Atingiu pontuação suficiente em todos os pilares para receber um certificado de nível.",
  },
  {
    code: "first_verb",
    title: "Primeiro Verbo",
    description: "Estudou o seu primeiro verbo irregular do dia.",
  },
  {
    code: "first_dictation",
    title: "Primeiro Ditado",
    description: "Completou o seu primeiro exercício de ditado (ouvir e escrever).",
  },
];

async function seedAchievements() {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: { title: a.title, description: a.description },
      create: a,
    });
  }
}

// Vocabulário standalone (content/curriculum/vocabulary-bank*.json) — não
// associado a nenhuma lição, ao contrário do vocabulário de cada módulo.
// Alimenta imediatamente o Desafio Diário e a Revisão (SRS), que já pescam de
// todos os VocabularyItem existentes. Vagas sucessivas ficam em ficheiros
// separados (vocabulary-bank-2.json, -3.json...) para cada Write ficar
// gerível — basta adicionar ao array VOCABULARY_BANKS abaixo. Ver
// docs/decisions.md 2026-08-26 sobre a decisão de escala responsável.
const VOCABULARY_BANKS = [vocabularyBank, vocabularyBank2, vocabularyBank3, vocabularyBank4, vocabularyBank5, vocabularyBank6, vocabularyBank7, vocabularyBank8, vocabularyBank9, vocabularyBank10, vocabularyBank11, vocabularyBank12, vocabularyBank13, vocabularyBank14, vocabularyBank15, vocabularyBank16, vocabularyBank17, vocabularyBank18, vocabularyBank19];

async function seedVocabularyBank() {
  // Achado N6 (auditoria 2026-08-27): eram 2.000+ upserts sequenciais, o
  // grosso do tempo de build do seed. Cada palavra é independente das outras
  // (ids distintos, sem FK entre si), por isso corre em lotes de 25 em
  // paralelo em vez de um de cada vez — ver mapWithConcurrency() acima.
  const allWords = VOCABULARY_BANKS.flatMap((bank) => bank.words);
  await mapWithConcurrency(allWords, 25, (v) =>
    prisma.vocabularyItem.upsert({
      where: { id: v.id },
      update: {
        headword: v.headword,
        translationPt: v.translation_pt,
        definitionEn: v.definition_en,
        cefr: v.cefr_level as any,
        exampleSentences: v.example_sentences,
        difficulty: v.difficulty,
      },
      create: {
        id: v.id,
        headword: v.headword,
        translationPt: v.translation_pt,
        definitionEn: v.definition_en,
        cefr: v.cefr_level as any,
        exampleSentences: v.example_sentences,
        difficulty: v.difficulty,
      },
    })
  );
  console.log(`Seeded ${allWords.length} standalone vocabulary items.`);
}

async function main() {
  await seedLevels();
  await seedAchievements();
  // Achado N6: módulos são independentes entre si (nenhum id ou FK partilhado
  // entre ficheiros de content/curriculum/, confirmado por grep antes de cada
  // lote de conteúdo desta sessão) — `lessonOrder` já vem calculado do índice
  // no array, antes de qualquer chamada assíncrona, por isso a ordem final das
  // lições não depende da ordem de conclusão. Corre em lotes de 4 em paralelo.
  const moduleEntries = MODULE_FILES.map((moduleData, i) => ({ moduleData, lessonOrder: i + 1 }));
  await mapWithConcurrency(moduleEntries, 4, (entry) => seedModuleFile(entry.moduleData, entry.lessonOrder));
  await seedVocabularyBank();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
