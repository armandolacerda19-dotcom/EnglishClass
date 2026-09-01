import type { SVGProps } from "react";
import type { PillarIconName } from "@/lib/pillarDisplay";

// Ícones monoline por pilar (5ª auditoria, 2026-09-01) — mesmo espírito do
// SkillOctagon.tsx já existente: SVG inline desenhado à mão, sem depender de
// nenhuma livraria de ícones nova (orçamento zero para assets externos). Par
// visual do PILLAR_ACCENT (pillarDisplay.ts) — cor+forma identificam sempre o
// mesmo pilar, para não depender só de cor (acessibilidade).
const PATHS: Record<PillarIconName, React.ReactNode> = {
  grammar: (
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="15" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </>
  ),
  vocabulary: (
    <>
      <path d="M11 3H5a2 2 0 0 0-2 2v6l9.5 9.5a2 2 0 0 0 2.8 0l5.7-5.7a2 2 0 0 0 0-2.8L11 3Z" />
      <circle cx="7.5" cy="7.5" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  listening: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
    </>
  ),
  reading: (
    <>
      <path d="M12 6c-1.5-1.3-4-2-7-2v13c3 0 5.5.7 7 2 1.5-1.3 4-2 7-2V4c-3 0-5.5.7-7 2Z" />
      <line x1="12" y1="6" x2="12" y2="19" />
    </>
  ),
  translation: (
    <>
      <path d="M6 7h11M14 7l3-3M14 7l3 3" />
      <path d="M18 17H7M10 17l-3-3M10 17l-3 3" />
    </>
  ),
  speaking: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <line x1="12" y1="18" x2="12" y2="21" />
      <line x1="9" y1="21" x2="15" y2="21" />
    </>
  ),
  pronunciation: (
    <>
      <line x1="4" y1="9" x2="4" y2="15" />
      <line x1="8" y1="5" x2="8" y2="19" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="16" y1="5" x2="16" y2="19" />
      <line x1="20" y1="9" x2="20" y2="15" />
    </>
  ),
  writing: (
    <>
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z" />
      <line x1="14" y1="7" x2="17" y2="10" />
    </>
  ),
};

export function PillarIcon({ name, ...props }: { name: PillarIconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {PATHS[name]}
    </svg>
  );
}
