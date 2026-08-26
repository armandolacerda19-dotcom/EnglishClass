// Reservado exclusivamente para erros de interferência PT→EN — ver docs/09-sistema-design.md.
// Clay é uma cor semântica fixa: nunca usar este componente/tom para outro tipo de aviso.

export function ErrorCallout({ label = "Erro comum PT→EN", children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border-l-4 border-clay bg-clay/5 p-4">
      <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-clay">{label}</p>
      <p className="text-sm text-inkNeutral dark:text-linen">{children}</p>
    </div>
  );
}
