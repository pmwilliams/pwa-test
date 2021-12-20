export const { MDCCheckbox } = window.mdc.checkbox;
export const { MDCChipSet } = window.mdc.chips;
export const { MDCFormField } = window.mdc.formField;
export const { MDCRadio } = window.mdc.radio;
export const { MDCTextField } = window.mdc.textField;
export const { MDCRipple } = window.mdc.ripple;
export const { MDCList } = window.mdc.list;
export const { MDCDialog } = window.mdc.dialog;

const registerAndInit = () => {
  window.mdc.autoInit.register('MDCCheckbox', MDCCheckbox);
  window.mdc.autoInit.register('MDCChipSet', MDCChipSet);
  window.mdc.autoInit.register('MDCFormField', MDCFormField);
  window.mdc.autoInit.register('MDCRadio', MDCRadio);
  window.mdc.autoInit.register('MDCTextField', MDCTextField);
  window.mdc.autoInit.register('MDCRipple', MDCRipple);
  window.mdc.autoInit.register('MDCList', MDCList);
  window.mdc.autoInit();
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target.classList.contains('mdc-chip')) {
      e.preventDefault();
    }
  });
};

const registerServiceWorker = (relativePath) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${relativePath}worker.js`);
  }
};

export const initPage = (relativePath) => {
  registerServiceWorker(relativePath);
  window.addEventListener('load', () => registerAndInit());
};
