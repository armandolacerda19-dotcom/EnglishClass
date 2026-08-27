// Service worker — instalável (manifest + SW é requisito do Chrome) e, desde
// 2026-08-26 (item #13 da lista de melhorias), cache-first só para o "shell"
// estático (ícones, manifest) para o essencial funcionar offline. Deliberadamente
// NÃO cacheia páginas/dados dinâmicos: esta app depende de sessão e dados em
// tempo real (progresso, IA), e servir uma página HTML antiga a partir da cache
// seria pior do que mostrar "sem ligação" — ver docs/decisions.md.

const SHELL_CACHE = "shell-v1";
const SHELL_ASSETS = ["/manifest.webmanifest", "/icon.svg", "/icon-maskable.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const isShellAsset = SHELL_ASSETS.includes(url.pathname);

  if (isShellAsset) {
    // Cache-first: são ficheiros estáticos que raramente mudam.
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
    return;
  }

  // Todo o resto: network-first, sem fallback de cache (ver nota acima).
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
