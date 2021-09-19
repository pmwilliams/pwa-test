export const MDCCheckbox = window.mdc.checkbox.MDCCheckbox;
export const MDCChipSet = window.mdc.chips.MDCChipSet;
export const MDCFormField = window.mdc.formField.MDCFormField;
export const MDCRadio = window.mdc.radio.MDCRadio;
export const MDCTextField = window.mdc.textField.MDCTextField;

export const registerAndInit = () => {
  window.mdc.autoInit.register('MDCCheckbox', MDCCheckbox);
  window.mdc.autoInit.register('MDCChipSet', MDCChipSet);
  window.mdc.autoInit.register('MDCFormField', MDCFormField);
  window.mdc.autoInit.register('MDCRadio', MDCRadio);
  window.mdc.autoInit.register('MDCTextField', MDCTextField);
  window.mdc.autoInit();
  window.addEventListener('keydown', e => {
    if(e.key == ' ' && e.target.classList.contains('mdc-chip')) {
      e.preventDefault();
    }
  })
}
