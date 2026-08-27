"use client";

import { useEffect } from "react";

// Regista o service worker para a app poder ser instalada no Android (e outros
// browsers com suporte a PWA) via "Adicionar ao ecrã principal" — pedido do
// utilizador, ver PROJECT_STATE.md. Sem isto, o manifest sozinho normalmente
// não é suficiente para o Chrome mostrar o botão de instalar.
export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // instalação da PWA é um extra, não crítico — falhar em silêncio
      });
    }
  }, []);

  return null;
}
