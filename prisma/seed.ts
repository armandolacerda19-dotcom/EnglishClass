import { PrismaClient, Pillar } from "@prisma/client";
import levelsData from "../content/curriculum/levels.json";
import module01 from "../content/curriculum/a1-module-01-daily-life.json";

const prisma = new PrismaClient();

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

async function seedModule01() {
  const sublevel = await prisma.sublevel.findUniqueOrThrow({
    where: { code: module01.sublevel_code },
  });

  const dbModule = await prisma.module.upsert({
    where: { id: module01.module.id },
    update: { title: module01.module.title, theme: module01.module.theme, order: module01.module.order, sublevelId: sublevel.id },
    create: {
      id: module01.module.id,
      title: module01.module.title,
      theme: module01.module.theme,
      order: module01.module.order,
      sublevelId: sublevel.id,
    },
  });

  const dbUnit = await prisma.unit.upsert({
    where: { id: module01.unit.id },
    update: { title: module01.unit.title, order: module01.unit.order, skippable: module01.unit.skippable, moduleId: dbModule.id },
    create: {
      id: module01.unit.id,
      title: module01.unit.title,
      order: module01.unit.order,
      skippable: module01.unit.skippable,
      moduleId: dbModule.id,
    },
  });

  const gc = module01.grammar_concept;
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

  for (const v of module01.vocabulary) {
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
    where: { id: module01.lesson.id },
    update: {
      title: module01.lesson.title,
      pillars: module01.lesson.pillars.map((p) => p.toUpperCase()) as Pillar[],
      order: 1,
      contentJson: module01.lesson as any,
      unitId: dbUnit.id,
    },
    create: {
      id: module01.lesson.id,
      title: module01.lesson.title,
      pillars: module01.lesson.pillars.map((p) => p.toUpperCase()) as Pillar[],
      order: 1,
      contentJson: module01.lesson as any,
      unitId: dbUnit.id,
    },
  });

  for (const ex of module01.exercises) {
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

  console.log(`Seeded module "${dbModule.title}" → unit "${dbUnit.title}" → lesson "${dbLesson.title}" (concept: ${dbConcept.title})`);
}

async function main() {
  await seedLevels();
  await seedModule01();
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
