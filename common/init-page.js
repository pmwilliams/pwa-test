import { initialiseApplicationShell } from './app-shell.js';

export const initPage = relativePath => {
  registerServiceWorker(relativePath);
  addElementsToHead(relativePath);
  initialiseApplicationShell(relativePath);
}


export const registerServiceWorker = (relativePath) => {
  window.onload = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${relativePath}worker.js`);
    }
  }
}

export const addElementsToHead = (relativePath) => {
  document.head.innerHTML += `
    <!-- global styles -->
    <link rel="stylesheet" href="${relativePath}style.css">
    
    <!-- material -->
    <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    
    <!-- pwa -->
    <link rel="manifest" href="${relativePath}manifest.json">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#fff">
    <link rel="icon" href="${relativePath}favicon.ico" type="image/x-icon" />  
    <link rel="apple-touch-icon" href="${relativePath}images/icon-152.png">  
    <meta name="apple-mobile-web-app-capable" content="yes">  
    <meta name="apple-mobile-web-app-status-bar-style" content="black"> 
    <meta name="apple-mobile-web-app-title" content="PWA Test"> 
    <meta name="msapplication-TileImage" content="${relativePath}images/icon-144.png">  
    <meta name="msapplication-TileColor" content="#FFFFFF">
  `;
}
