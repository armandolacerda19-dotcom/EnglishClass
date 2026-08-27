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

const prisma = new PrismaClient();

// Cada ficheiro em content/curriculum/ segue o formato de docs/08-schema-json-conteudo.md:
// um módulo com uma unidade, um conceito de gramática, vocabulário, exercícios e uma lição.
// Adicionar conteúdo novo = adicionar um ficheiro aqui, sem tocar na lógica de seed abaixo.
const MODULE_FILES = [
  moduleFirstWords,
  moduleDailyLife,
  moduleAboutMe,
  moduleShopping,
  moduleComparatives,
  moduleRestaurant,
  modulePastSimple,
  moduleFuturePlans,
  moduleExperiences,
  moduleObligation,
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

async function main() {
  await seedLevels();
  await seedAchievements();
  for (let i = 0; i < MODULE_FILES.length; i++) {
    await seedModuleFile(MODULE_FILES[i]!, i + 1);
  }
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
