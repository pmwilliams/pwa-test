window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('worker.js');
  }

  if(window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(function(status) {
      var notification = new Notification(
        'PWA Test', 
        { body: 'This is your PWA notification' }); 
    });
  }
}
