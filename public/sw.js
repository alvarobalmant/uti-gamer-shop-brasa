// Service Worker for aggressive caching and performance
const CACHE_NAME = 'uti-games-v1';
const STATIC_CACHE = 'uti-static-v1';
const DYNAMIC_CACHE = 'uti-dynamic-v1';
const IMAGE_CACHE = 'uti-images-v1';

const STATIC_ASSETS = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

const CACHE_STRATEGIES = {
  // Critical resources - Cache first with network fallback
  critical: [
    /\/src\/main\.tsx$/,
    /\/src\/index\.css$/,
    /\/assets\/.*\.(js|css)$/
  ],
  
  // Images - Cache first, stale while revalidate
  images: [
    /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
    /lovable-uploads/,
    /supabase.*storage/
  ],
  
  // API calls - Network first with cache fallback
  api: [
    /\/rest\/v1\//,
    /supabase\.co/
  ],
  
  // Fonts - Cache first
  fonts: [
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
    /\.(woff|woff2|ttf|eot)$/
  ]
};

// Install event - Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => 
        cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })))
      ),
      self.skipWaiting()
    ])
  );
});

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames =>
        Promise.all(
          cacheNames
            .filter(name => name.startsWith('uti-') && !name.includes('v1'))
            .map(name => caches.delete(name))
        )
      ),
      self.clients.claim()
    ])
  );
});

// Fetch event - Implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and dev server requests
  if (url.protocol === 'chrome-extension:' || url.hostname === 'localhost') return;

  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Critical resources - Cache first
    if (CACHE_STRATEGIES.critical.some(pattern => pattern.test(url.pathname))) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // Images - Cache first with stale while revalidate
    if (CACHE_STRATEGIES.images.some(pattern => pattern.test(url.href))) {
      return await staleWhileRevalidate(request, IMAGE_CACHE);
    }
    
    // Fonts - Cache first
    if (CACHE_STRATEGIES.fonts.some(pattern => pattern.test(url.href))) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // API calls - Network first
    if (CACHE_STRATEGIES.api.some(pattern => pattern.test(url.href))) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // Default - Network first for HTML, cache first for assets
    if (request.destination === 'document') {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    return await cacheFirst(request, STATIC_CACHE);
    
  } catch (error) {
    console.error('SW fetch error:', error);
    return fetch(request);
  }
}

// Cache first strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    throw error;
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  return cached || await fetchPromise;
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any queued requests when connection is restored
  console.log('Background sync triggered');
}