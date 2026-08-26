// Única visualização tipo radar do produto — justificada porque a estrutura de dados é
// literalmente óctupla (8 pilares), não decorativa. Ver docs/09-sistema-design.md.

const PILLAR_LABELS: Record<string, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  listening: "Listening",
  speaking: "Speaking",
  pronunciation: "Pronunciation",
  reading: "Reading",
  writing: "Writing",
  translation: "Translation",
};

const ORDER = ["grammar", "vocabulary", "listening", "speaking", "pronunciation", "reading", "writing", "translation"];

export function SkillOctagon({ scores }: { scores: Record<string, number> }) {
  const size = 220;
  const center = size / 2;
  const maxRadius = size / 2 - 24;

  const points = ORDER.map((pillar, i) => {
    const angle = (Math.PI * 2 * i) / ORDER.length - Math.PI / 2;
    const value = Math.max(0, Math.min(100, scores[pillar] ?? 0));
    const radius = (value / 100) * maxRadius;
    return {
      pillar,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
      labelX: center + (maxRadius + 14) * Math.cos(angle),
      labelY: center + (maxRadius + 14) * Math.sin(angle),
    };
  });

  const polygon = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Perfil de competência por pilar">
      {[25, 50, 75, 100].map((ring) => (
        <circle
          key={ring}
          cx={center}
          cy={center}
          r={(ring / 100) * maxRadius}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.1}
        />
      ))}
      <polygon points={polygon} fill="#3E7C6B" fillOpacity={0.25} stroke="#3E7C6B" strokeWidth={2} />
      {points.map((p) => (
        <text key={p.pillar} x={p.labelX} y={p.labelY} textAnchor="middle" fontSize={9} className="fill-current">
          {PILLAR_LABELS[p.pillar]}
        </text>
      ))}
    </svg>
  );
}
