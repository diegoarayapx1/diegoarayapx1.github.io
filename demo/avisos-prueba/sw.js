// Prueba de avisos · service worker
// Solo maneja avisos: no guarda la página en caché.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let d = {};
  try {
    d = event.data ? event.data.json() : {};
  } catch {
    d = { body: event.data ? event.data.text() : '' };
  }
  // Siempre se muestra un aviso: iOS puede cortar la suscripción si llega un push sin aviso visible.
  event.waitUntil(self.registration.showNotification(d.title || 'Aviso de prueba', {
    body: d.body || '',
    icon: '/demo/sellos/icono-180.png',
    data: { url: d.url || self.registration.scope },
  }));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || self.registration.scope;
  event.waitUntil((async () => {
    const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const v of ventanas) {
      if (v.url === url && 'focus' in v) return v.focus();
    }
    return self.clients.openWindow(url);
  })());
});
