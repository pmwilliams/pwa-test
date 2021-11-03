export const MDCCheckbox = window.mdc.checkbox.MDCCheckbox;
export const MDCChipSet = window.mdc.chips.MDCChipSet;
export const MDCFormField = window.mdc.formField.MDCFormField;
export const MDCRadio = window.mdc.radio.MDCRadio;
export const MDCTextField = window.mdc.textField.MDCTextField;
export const MDCRipple = window.mdc.ripple.MDCRipple;
export const MDCList = window.mdc.list.MDCList;

const registerAndInit = () => {
  window.mdc.autoInit.register('MDCCheckbox', MDCCheckbox);
  window.mdc.autoInit.register('MDCChipSet', MDCChipSet);
  window.mdc.autoInit.register('MDCFormField', MDCFormField);
  window.mdc.autoInit.register('MDCRadio', MDCRadio);
  window.mdc.autoInit.register('MDCTextField', MDCTextField);
  window.mdc.autoInit.register('MDCRipple', MDCRipple);
  window.mdc.autoInit.register('MDCList', MDCList);
  window.mdc.autoInit();
  window.addEventListener('keydown', e => {
    if(e.key == ' ' && e.target.classList.contains('mdc-chip')) {
      e.preventDefault();
    }
  })
}

const registerServiceWorker = (relativePath) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${relativePath}worker.js`);
  }
}

const addElementsToHead = (relativePath) => {
  document.head.innerHTML += `
    <link rel="manifest" href="${relativePath}manifest.json">
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

export const initPage = relativePath => {
  registerServiceWorker(relativePath);
  addElementsToHead(relativePath);
  window.addEventListener("load", () => registerAndInit());
}
