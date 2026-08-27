"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function setImmersionMode(enabled: boolean) {
  const user = await requireUser();
  await prisma.learningProfile.update({
    where: { userId: user.id },
    data: { immersionMode: enabled },
  });
}

export async function setAccessibleReadingMode(enabled: boolean) {
  const user = await requireUser();
  await prisma.learningProfile.update({
    where: { userId: user.id },
    data: { accessibleReadingMode: enabled },
  });
}
