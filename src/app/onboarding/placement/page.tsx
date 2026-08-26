import { requireUser } from "@/lib/session";
import { PlacementTestRunner } from "@/components/placement/PlacementTestRunner";

export default async function PlacementPage() {
  await requireUser();
  return <PlacementTestRunner />;
}
