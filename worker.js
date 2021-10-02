var cacheName = 'pwa-test';
var filesToCache = [
  'index.html',
  'style.css',
  'common/app-shell.js',
  'common/init-index-page.js',
  'common/init-page.js',
  'common/init-sub-page.js',
  'common/mdc.js',
  'common/routes.js',
  'pages/contacts/contacts.html',
  'pages/contacts/contacts.js',
  'pages/contacts/contacts.css',
  'pages/notifications/notifications.html',
  'pages/notifications/notifications.js',
  'pages/notifications/notifications.css',
  'pages/share/share.html',
  'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js',
  'https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', function(e) {
  console.log('install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('activate');
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
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
