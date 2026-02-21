self.addEventListener('install', (e) => {
    console.log('[Service Worker] Instalado');
});

self.addEventListener('fetch', (e) => {
    // Permite que o app funcione abrindo o navegador internamente
    e.respondWith(fetch(e.request));
});
