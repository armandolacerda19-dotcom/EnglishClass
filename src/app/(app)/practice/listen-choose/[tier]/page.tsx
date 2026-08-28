import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { getListenChooseSet } from "@/lib/listenChoose";
import { ListenChooseRunner } from "@/components/challenge/ListenChooseRunner";

const VALID_TIERS = new Set(["beginner", "intermediate", "advanced"]);

export default async function ListenChooseTierPage({ params }: { params: { tier: string } }) {
  await requireUserWithProfile();
  if (!VALID_TIERS.has(params.tier)) notFound();

  const tier = params.tier as "beginner" | "intermediate" | "advanced";
  const items = getListenChooseSet(tier);

  return <ListenChooseRunner tier={tier} items={items} />;
}
