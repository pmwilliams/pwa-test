var cacheName = 'pwa-test-v2';
var filesToCache = [
  'index.html',
  'style.css',
  'common/app-shell.js',
  'common/app-shell.css',
  'common/init-page.js',
  'pages/contacts/contacts.html',
  'pages/contacts/contacts.js',
  'pages/contacts/contacts.css',
  'pages/notifications/notifications.html',
  'pages/notifications/notifications.js',
  'pages/notifications/notifications.css',
  'pages/share/share.html',
  'pages/share/share.js',
  'pages/share/share.css',
  'https://unpkg.com/material-components-web@13.0.0/dist/material-components-web.min.js',
  'https://unpkg.com/material-components-web@13.0.0/dist/material-components-web.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(clients.matchAll( { includeUncontrolled: true } ).then(r => {
    r.forEach(client => client.postMessage({ 
      type: 'notificationclick',
      action: event.action,
      timestamp: event.notification.timestamp
    }));
    if (event.action === 'dismiss') {
      event.notification.close();
    }
  }));
});

self.addEventListener('notificationclose', (event) => { 
  event.waitUntil(clients.matchAll( { includeUncontrolled: true } ).then(r => {
    r.forEach(client => client.postMessage({ 
      type: 'notificationclose',
      action: event.action,
      timestamp: event.notification.timestamp
    }));
  }));
});
