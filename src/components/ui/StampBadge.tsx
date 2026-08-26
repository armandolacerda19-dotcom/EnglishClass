// Elemento de assinatura do produto — ver "O Carimbo de Passaporte" em docs/09-sistema-design.md.
// Único elemento decorativo recorrente; usar apenas em conclusão de subnível, conquistas e certificados.

export function StampBadge({
  code,
  tone = "verdigris",
}: {
  code: string;
  tone?: "verdigris" | "brass";
}) {
  const ring = tone === "brass" ? "border-brass text-brass" : "border-verdigris text-verdigris";

  return (
    <div
      className={`inline-flex h-16 w-16 -rotate-6 items-center justify-center rounded-full border-2 ${ring} font-mono text-xs font-semibold`}
      aria-hidden="false"
      role="img"
      aria-label={`Carimbo de progresso: ${code}`}
    >
      {code}
    </div>
  );
}
