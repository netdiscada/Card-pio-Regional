const CACHE_NAME = 'cardapio-cache-v2';

// Instala o motor offline
self.addEventListener('install', event => {
    self.skipWaiting();
});

// Limpa versões antigas do site quando houver atualizações
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                })
            );
        })
    );
    self.clients.claim();
});

// Intercepta tudo: Se tiver internet, baixa e salva. Se não tiver internet, mostra o salvo.
self.addEventListener('fetch', event => {
    // Ignora conexões externas com o Firebase para não quebrar as regras de segurança
    if (event.request.url.includes('firestore.googleapis.com') || 
        event.request.url.includes('securetoken.googleapis.com') ||
        event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Se a internet cair, puxa do celular automaticamente
                return caches.match(event.request);
            })
    );
});
