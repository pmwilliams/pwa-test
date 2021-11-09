import { 
  initPage
} from '../../common/init-page.js';

initPage('../../');

const app = document.querySelector('application-shell');

const isContactsManagerSupported = () => Boolean(window.ContactsManager);
const isContactsSupported = () => Boolean(navigator.contacts);
const supportedProperties = navigator.contacts ? await navigator.contacts.getProperties() : [];

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
 