// Service worker mínimo — existe só para satisfazer o critério de "instalável"
// do Chrome/Android (manifest + service worker com fetch handler). Não faz
// caching agressivo de propósito: esta app depende de dados em tempo real
// (sessão, progresso, respostas de IA) e cache desatualizado seria pior do
// que não ter cache nenhum. Ver docs/decisions.md.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
