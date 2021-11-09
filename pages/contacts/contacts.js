import { 
  initPage
} from '../../common/init-page.js';

const MAX_VISIBLE_CONTACTS = 20;

initPage('../../');

const supportedProperties = navigator.contacts ? await navigator.contacts.getProperties() : [];
const opts = { multiple: true };

const drawContacts = (contacts) => {
  const list = document.querySelector('#contacts ul');
  Object.values(contacts)
    .slice(0, MAX_VISIBLE_CONTACTS)
    .forEach(contact => {
      const template = document.querySelector('#contact-item')
      var clone = template.content.cloneNode(true);
      clone.querySelector('.contact-name').textContent = contact.name.length ? contact.name[0] : 'n/a';
      clone.querySelector('.contact-address').textContent = contact.address.length ? contact.address[0] : 'n/a';
      clone.querySelector('.contact-email').textContent = contact.email.length ? contact.email[0] : 'n/a';
      clone.querySelector('.contact-tel').textContent = contact.tel.length ? contact.tel[0] : 'n/a';
      list.insertBefore(clone, list.firstChild);
    });
  const items = list.querySelectorAll('li');
  if (items.length > MAX_VISIBLE_CONTACTS) {
    [...items].slice(MAX_VISIBLE_CONTACTS).forEach(child => child.remove());
  }
}

const onFabClick = async () => {
  if (!navigator.contacts) {
    drawContacts([
      { address: ["address"], email: ["email"], name: ["name"], tel: ["tel"] },
      { address: [], email: [], name: [], tel: [] },
      { address: ["address2"], email: ["email2"], name: ["name2"], tel: ["tel2"] }
    ]);
  } else {
    const selected = await navigator.contacts.select(supportedProperties, opts);
    drawContacts(selected);
  }
}

document.querySelector('#add-contacts-fab').addEventListener('click', onFabClick);

const app = document.querySelector('application-shell');

const isContactsManagerSupported = () => Boolean(window.ContactsManager);
const isContactsSupported = () => Boolean(navigator.contacts);

const getApi = () => ([
  { 
    name: 'window', 
    items: [
      { name: 'ContactsManager', supported: isContactsManagerSupported() },
    ]
  },
  { 
    name: 'navigator', 
    items: [
      { name: '.contacts', supported: isContactsSupported() },
    ]
  },
  { 
    name: 'contacts.supportedProperties', 
    items: [
      { name: 'name', supported: supportedProperties.includes('name') },
      { name: 'email', supported: supportedProperties.includes('email') },
      { name: 'tel', supported: supportedProperties.includes('tel') },
      { name: 'address', supported: supportedProperties.includes('address') },
      { name: 'icon', supported: supportedProperties.includes('icon') },
    ]
  }
]);

app.apiSummary = getApi();
 