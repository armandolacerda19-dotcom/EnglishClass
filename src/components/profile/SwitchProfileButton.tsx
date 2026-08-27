import { switchProfile } from "@/app/profiles/actions";

// Sai do perfil ativo (sem terminar a sessão da conta) e volta ao seletor —
// Fase 6 ("Família"). Server Action simples, sem estado de cliente.
export function SwitchProfileButton() {
  return (
    <form action={switchProfile}>
      <button
        type="submit"
        className="rounded-control border border-ink/10 px-4 py-2 text-sm hover:border-verdigris dark:border-linen/10"
      >
        Trocar de perfil
      </button>
    </form>
  );
}
