import { initPage, MDCDialog } from '../../common/init-page.js';

const MAX_VISIBLE_CONTACTS = 20;

initPage('../../');

const opts = { multiple: true };
const getSupportedProperties = async () => {
  if (!navigator.contacts) {
    return [];
  }
  return navigator.contacts.getProperties();
};
let contactId = 0;
const contacts = [];

const updateContactDetail = (parent, id, values, selector, accessor) => {
  if (values.length) {
    parent.querySelector(`${selector} .contact-detail__label`).textContent = accessor(values);
    if (values.length > 1) {
      const moreLink = parent.querySelector(`${selector} .contact-detail__more`);
      moreLink.textContent = `(+ ${values.length - 1} more)`;
      moreLink.setAttribute('data-id', id);
    }
  } else {
    parent.querySelector(selector).classList.add('contact-detail--hidden');
  }
};

const drawContacts = () => {
  const list = document.querySelector('#contacts ul');
  Object.values(contacts)
    .slice(0, MAX_VISIBLE_CONTACTS)
    .forEach((contact) => {
      const template = document.querySelector('#contact-item');
      const clone = template.content.cloneNode(true);
      updateContactDetail(clone, contact.id, contact.name, '.contact-name', (items) => items[0]);
      updateContactDetail(clone, contact.id, contact.address, '.contact-address', (items) => items[0].addressLine);
      updateContactDetail(clone, contact.id, contact.tel, '.contact-phone', (items) => items[0]);
      updateContactDetail(clone, contact.id, contact.email, '.contact-email', (items) => items[0]);
      if (contact.icon.length) {
        const iconURL = URL.createObjectURL(contact.icon[0]);
        clone.querySelector('.contact-icon').src = iconURL;
      }
      list.insertBefore(clone, list.firstChild);
    });
  const items = list.querySelectorAll('li');
  if (items.length > MAX_VISIBLE_CONTACTS) {
    [...items].slice(MAX_VISIBLE_CONTACTS).forEach((child) => child.remove());
  }
};

const updateContacts = (newContacts) => {
  newContacts.forEach((contact) => {
    contacts.push({
      id: (contactId += 1),
      ...contact,
    });
  });
};

const onFabClick = async () => {
  if (!navigator.contacts) {
    const response = await fetch(new Request('../../images/icon-256.png'));
    const blob = await response.blob();

    updateContacts([
      {
        address: [{ addressLine: '15 acacia avenue' }],
        email: ['bob@bob.com', 'bill@bill.com', 'harry@hotmail.com'],
        name: ['Bob Smith', 'Bill Jones', 'Harry Bottomley'],
        tel: ['3242 2342 32424'],
        icon: [blob],
      },
      {
        address: [],
        email: [],
        name: ['Steve'],
        tel: ['234 232 3232', '3434 3434 432', '323 4343 2342'],
        icon: [],
      },
      {
        address: [{ addressLine: '10 sesame street, New York, USA' }, { addressLine: '56 high street, London, UK' }],
        email: ['bill@bob.com'],
        name: ['Harry'],
        tel: ['444 879 4456', '222 323 4342', '455 232 3232'],
        icon: [blob],
      },
    ]);
    drawContacts();
  } else {
    const selected = await navigator.contacts.select(await getSupportedProperties(), opts);
    updateContacts(selected);
    drawContacts();
  }
};

const createLabels = (parent, values) => {
  values.forEach((item) => {
    const label = document.createElement('div');
    label.textContent = item;
    parent.appendChild(label);
  });
};

const showMoreInfoDialog = (event) => {
  if (!event.target.classList.contains('contact-detail__more')) {
    return;
  }
  const id = event.target.getAttribute('data-id');
  const dialogElement = document.querySelector('#more-info-dialog');
  const dialog = new MDCDialog(dialogElement);
  const contact = contacts.find((item) => `${item.id}` === id);
  [dialogElement.querySelector('#dialog-title').textContent] = contact.name;
  const contentElement = dialogElement.querySelector('#dialog-content');
  createLabels(
    contentElement,
    contact.address.map((value) => value.addressLine)
  );
  createLabels(contentElement, contact.email);
  createLabels(contentElement, contact.tel);
  dialog.open();
};

document.querySelector('#add-contacts-fab').addEventListener('click', onFabClick);
document.querySelector('#contacts').addEventListener('click', showMoreInfoDialog);

const app = document.querySelector('application-shell');

const isContactsManagerSupported = () => Boolean(window.ContactsManager);
const isContactsSupported = () => Boolean(navigator.contacts);

const getApi = async () => {
  const supportedProperties = await getSupportedProperties();
  return [
    {
      name: 'window',
      items: [{ name: 'ContactsManager', supported: isContactsManagerSupported() }],
    },
    {
      name: 'navigator',
      items: [{ name: '.contacts', supported: isContactsSupported() }],
    },
    {
      name: 'contacts.supportedProperties',
      items: [
        { name: 'name', supported: supportedProperties.includes('name') },
        { name: 'email', supported: supportedProperties.includes('email') },
        { name: 'tel', supported: supportedProperties.includes('tel') },
        { name: 'address', supported: supportedProperties.includes('address') },
        { name: 'icon', supported: supportedProperties.includes('icon') },
      ],
    },
  ];
};

getApi().then((api) => {
  app.apiSummary = api;
});
