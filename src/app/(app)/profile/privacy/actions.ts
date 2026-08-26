"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// Eliminação de conta — RGPD, disponível desde o MVP1. A maioria das relações tem
// onDelete: Cascade (ver prisma/schema.prisma), por isso apagar o User remove todo
// o histórico de aprendizagem associado.
export async function deleteAccount() {
  const user = await requireUser();
  const supabase = createClient();

  await prisma.user.delete({ where: { id: user.id } });
  await supabase.auth.signOut();

  redirect("/");
}
