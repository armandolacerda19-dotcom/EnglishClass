import Link from "next/link";
import { BottomNav } from "@/components/ui/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20">
      <header className="flex justify-end px-6 pt-4">
        <Link
          href="/profile/privacy"
          className="rounded-control px-2 py-1 font-mono text-xs text-inkNeutral/60 hover:text-verdigris dark:text-linen/60"
        >
          Perfil
        </Link>
      </header>
      {children}
      <BottomNav />
    </div>
  );
}
