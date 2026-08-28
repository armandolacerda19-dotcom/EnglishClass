"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { requireAccount, ACTIVE_PROFILE_COOKIE } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const AVATAR_COLORS = ["verdigris", "brass", "clay"];

// Fase 16 (auditoria 2026-08-28, achado S5, residual da 2ª auditoria): sem
// teto, uma conta podia chamar createProfile em loop e criar perfis sem
// limite — cada um arrasta ~15 tabelas de progresso (LearningProfile, XP,
// streak, erros, certificados...), um vetor real de esgotamento de espaço em
// BD, não só cosmético. 6 é generoso para o uso real (família alargada),
// mesmo critério de "estilo Netflix" já citado no histórico da Fase 6.
const MAX_PROFILES_PER_ACCOUNT = 6;

// Escolhe um perfil como ativo para o resto da sessão do browser — Fase 6
// ("Família"). `findFirst` com `userId: account.id` garante que ninguém
// consegue ativar um perfil de outra conta adivinhando o id (o mesmo
// cuidado de autorização já usado noutros sítios da app, ex. conversas de
// IA — ver docs/decisions.md, auditoria 2026-08-26).
export async function selectProfile(profileId: string) {
  const account = await requireAccount();

  const profile = await prisma.profile.findFirst({ where: { id: profileId, userId: account.id } });
  if (!profile) redirect("/profiles?error=Perfil não encontrado.");

  cookies().set(ACTIVE_PROFILE_COOKIE, profileId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/home");
}

// Cria um novo perfil (ex. um filho, um cônjuge) dentro da conta e ativa-o
// logo a seguir — vai para /onboarding porque um perfil novo nunca tem
// LearningProfile ainda (ver requireUserWithProfile em session.ts).
export async function createProfile(formData: FormData) {
  const account = await requireAccount();
  const name = String(formData.get("name") ?? "").trim().slice(0, 60);
  const isChild = formData.get("isChild") === "on";

  if (!name) redirect("/profiles?error=Escreva um nome.");

  const existing = await prisma.profile.count({ where: { userId: account.id } });
  if (existing >= MAX_PROFILES_PER_ACCOUNT) {
    redirect(`/profiles?error=Limite de ${MAX_PROFILES_PER_ACCOUNT} perfis por conta atingido.`);
  }
  const avatarColor = AVATAR_COLORS[existing % AVATAR_COLORS.length]!;

  const profile = await prisma.profile.create({
    data: { userId: account.id, name, isChild, avatarColor },
  });

  cookies().set(ACTIVE_PROFILE_COOKIE, profile.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/onboarding");
}

// Sai do perfil ativo sem terminar sessão na conta — volta ao seletor.
// Usado pelo link "Trocar de perfil" em /profile/settings.
export async function switchProfile() {
  cookies().delete(ACTIVE_PROFILE_COOKIE);
  redirect("/profiles");
}
