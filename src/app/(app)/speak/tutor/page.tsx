import { requireUserWithProfile } from "@/lib/session";
import { TutorChat } from "@/components/tutor/TutorChat";

export default async function TutorPage() {
  await requireUserWithProfile();
  return <TutorChat />;
}
