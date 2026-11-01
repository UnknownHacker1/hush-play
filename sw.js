// The phone page's service worker. All it does is put up a notification when
// the laptop sends a push, for a phone whose page has gone to sleep. The push
// has nothing in it. It handles no requests and stores nothing.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('push', (e) => {
  e.waitUntil(self.registration.showNotification('HUSH', {
    body: 'The game is ringing your phone. It can hear that.',
    tag: 'hush-ring', renotify: true, requireInteraction: true,
    vibrate: [500, 250, 500, 250, 500, 250, 500],
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((all) => {
    const open = all.find((c) => /phone\.html/.test(c.url));
    return open ? open.focus() : self.clients.openWindow('phone.html');
  }));
});
