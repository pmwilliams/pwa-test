const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = { multiple: true };

const isSupported = 'contacts' in navigator;

document.querySelector('#select-contact-button').addEventListener('click', () => {
  navigator.contacts.select(props, opts);
  handleResults(contacts);
})