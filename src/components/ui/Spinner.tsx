// Indicador de carregamento — antes os ecrãs de correção só mostravam texto
// estático ("A verificar...", "A avaliar..."), sem nenhum sinal visual de que
// algo estava a acontecer. Pedido do utilizador (2026-08-26): "a correção mais
// rápida... mais intuitivo" — não dá para eliminar a latência real da IA, mas
// um indicador ativo muda a perceção de velocidade/profissionalismo. Respeita
// prefers-reduced-motion via globals.css (anima tudo para quase-instantâneo).
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
