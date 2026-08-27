"use server";

import { revalidatePath } from "next/cache";
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

// Fase 12 (auditoria 2026-08-27, "renomear perfil") — antes não havia forma
// nenhuma de corrigir o nome de um perfil depois de criado (ex. um erro de
// digitação ao adicionar um familiar em /profiles). `user.id` já é o id do
// Profile ativo (ver requireUser em session.ts), por isso o update é sempre
// no perfil da própria sessão — nunca recebe um id de perfil por fora.
export async function renameProfile(formData: FormData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  if (!name) return;
  await prisma.profile.update({ where: { id: user.id }, data: { name } });
  // Sem isto, o formulário submete e o novo nome fica guardado, mas o ecrã
  // (Server Component, cookies() torna a rota dinâmica mas não invalida por
  // si só o Router Cache do lado do cliente) continuava a mostrar o nome
  // antigo até a próxima navegação/reload manual.
  revalidatePath("/profile/settings");
}
