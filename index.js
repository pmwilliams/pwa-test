window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('worker.js');
  }

  /*Notification.requestPermission(result => {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(registration => registration.showNotification(
          'PWA Test', 
          { body: 'This is your PWA notification from service worker' }
      ));
    }
  });*/
}

