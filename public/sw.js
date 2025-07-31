// Service Worker para cache agressivo e performance extrema
const CACHE_NAME = 'uti-gamer-v1';
const CRITICAL_CACHE = 'uti-critical-v1';
const IMAGES_CACHE = 'uti-images-v1';
const API_CACHE = 'uti-api-v1';

// Recursos críticos para cache imediato
const CRITICAL_RESOURCES = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Estratégia de cache por tipo de recurso
const CACHE_STRATEGIES = {
  // Cache First para assets estáticos
  static: ['js', 'css', 'woff2', 'woff', 'ttf'],
  // Network First para API calls
  api: ['/api/', 'supabase.co'],
  // Stale While Revalidate para imagens
  images: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'],
  // Cache First para fontes
  fonts: ['fonts.googleapis.com', 'fonts.gstatic.com']
};

self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache recursos críticos
      caches.open(CRITICAL_CACHE).then(cache => {
        console.log('💾 Caching critical resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Pular espera para ativar imediatamente
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => 
              cacheName.startsWith('uti-') && 
              ![CACHE_NAME, CRITICAL_CACHE, IMAGES_CACHE, API_CACHE].includes(cacheName)
            )
            .map(cacheName => {
              console.log('🗑️ Removing old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      
      // Assumir controle de todas as abas
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Ignorar non-GET requests
  if (request.method !== 'GET') return;
  
  // Ignorar chrome-extension e outras URLs especiais
  if (!url.protocol.startsWith('http')) return;
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const extension = pathname.split('.').pop()?.toLowerCase();
  
  try {
    // Estratégia para recursos críticos
    if (CRITICAL_RESOURCES.some(resource => url.href.includes(resource))) {
      return await cacheFirst(request, CRITICAL_CACHE);
    }
    
    // Estratégia para fontes
    if (CACHE_STRATEGIES.fonts.some(domain => url.href.includes(domain))) {
      return await cacheFirst(request, CACHE_NAME);
    }
    
    // Estratégia para assets estáticos
    if (extension && CACHE_STRATEGIES.static.includes(extension)) {
      return await cacheFirst(request, CACHE_NAME);
    }
    
    // Estratégia para imagens
    if (extension && CACHE_STRATEGIES.images.includes(extension)) {
      return await staleWhileRevalidate(request, IMAGES_CACHE);
    }
    
    // Estratégia para APIs
    if (CACHE_STRATEGIES.api.some(pattern => url.href.includes(pattern))) {
      return await networkFirst(request, API_CACHE);
    }
    
    // Estratégia padrão para outras requisições
    if (pathname === '/' || pathname.includes('/produto/') || pathname.includes('/busca')) {
      return await networkFirst(request, CACHE_NAME);
    }
    
    // Fallback para network
    return await fetch(request);
    
  } catch (error) {
    console.warn('❌ Service Worker fetch error:', error);
    return await handleOffline(request);
  }
}

// Cache First - para assets estáticos
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // Revalidar em background se for antigo
    const cacheTime = new Date(cached.headers.get('date') || Date.now());
    const isStale = Date.now() - cacheTime.getTime() > 24 * 60 * 60 * 1000; // 24h
    
    if (isStale) {
      fetch(request).then(response => {
        if (response.ok) cache.put(request, response.clone());
      }).catch(() => {}); // Silenciar erros de background
    }
    
    return cached;
  }
  
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// Network First - para conteúdo dinâmico
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      console.log('📱 Serving from cache (offline):', request.url);
      return cached;
    }
    throw error;
  }
}

// Stale While Revalidate - para imagens
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Sempre tentar revalidar em background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached); // Fallback para cache em caso de erro
  
  // Retornar cache imediatamente se disponível
  if (cached) {
    return cached;
  }
  
  // Senão, aguardar network
  return await fetchPromise;
}

// Manipular requisições offline
async function handleOffline(request) {
  const url = new URL(request.url);
  
  // Para páginas HTML, retornar página offline ou homepage em cache
  if (request.headers.get('accept')?.includes('text/html')) {
    const cache = await caches.open(CACHE_NAME);
    const homepage = await cache.match('/');
    if (homepage) return homepage;
  }
  
  // Para imagens, retornar placeholder
  if (request.headers.get('accept')?.includes('image/')) {
    return new Response(
      `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="160" fill="#F3F4F6"/>
        <text x="100" y="85" text-anchor="middle" fill="#9CA3AF" font-family="Arial" font-size="12">
          Offline
        </text>
      </svg>`,
      {
        headers: { 'content-type': 'image/svg+xml' }
      }
    );
  }
  
  // Para outros recursos, retornar erro 503
  return new Response('Service Unavailable', { 
    status: 503,
    statusText: 'Service Unavailable (Offline)'
  });
}