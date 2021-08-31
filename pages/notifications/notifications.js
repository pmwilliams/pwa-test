const titleTextField = new window.mdc.textField.MDCTextField(document.querySelector('#notification-title'));
const contentTextField = new window.mdc.textField.MDCTextField(document.querySelector('#notification-content'));

document.querySelector('#notify-button').addEventListener('click', () => {
  Notification.requestPermission(result => {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(registration => registration.showNotification(
          titleTextField.value, 
          { body: contentTextField.value }
      ));
    }
  });
})
