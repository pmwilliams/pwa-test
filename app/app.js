const titleTextField = new window.mdc.textField.MDCTextField(document.querySelector('#notification-title'));
const contentTextField = new window.mdc.textField.MDCTextField(document.querySelector('#notification-content'));

const topAppBarElement = document.querySelector('#app-bar');
const listElement = document.querySelector('.mdc-drawer .mdc-list');
const drawerElement = document.querySelector('.mdc-drawer');
const mainContentElement = document.querySelector('.main-content');

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

const notificationsPage = document.querySelector('#notifications-page');
const contactsPage = document.querySelector('#contacts-page');
const sharePage = document.querySelector('#share-page');

window.addEventListener('hashchange', (event) => {
  console.log(window.location.hash)
  switch (window.location.hash) {
    case '':
    case '#': {
      notificationsPage.classList.add("show-page");
      contactsPage.classList.remove("show-page");
      sharePage.classList.remove("show-page");
      break;
    }
    case '#contacts': {
      notificationsPage.classList.remove("show-page");
      contactsPage.classList.add("show-page");
      sharePage.classList.remove("show-page");
      break;
    }
    case '#share': {
      notificationsPage.classList.remove("show-page");
      contactsPage.classList.remove("show-page");
      sharePage.classList.add("show-page");
      break;
    }
  }
});

const initModalDrawer = () => {
  drawerElement.classList.add("mdc-drawer--modal");
  const drawer = window.mdc.drawer.MDCDrawer.attachTo(drawerElement);
  drawer.open = false;
  
  const topAppBar = window.mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);
  topAppBar.setScrollTarget(mainContentElement);
  topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
  });

  listElement.addEventListener('click', () => {
    drawer.open = false;
  });
  
  return drawer;
}

const initPermanentDrawer = () => {
  drawerElement.classList.remove("mdc-drawer--modal");
  const list = new window.mdc.list.MDCList(listElement);
  list.wrapFocus = true;
  return list;
}

let drawer = window.matchMedia("(max-width: 900px)").matches ?
    initModalDrawer() : initPermanentDrawer();

const resizeHandler = () => { 
  if (window.matchMedia("(max-width: 900px)").matches && drawer instanceof window.mdc.list.MDCList) {
    drawer.destroy();
    drawer = initModalDrawer();
  } else if (window.matchMedia("(min-width: 900px)").matches && drawer instanceof window.mdc.drawer.MDCDrawer) {
    drawer.destroy();
    drawer = initPermanentDrawer();
  }
}

window.addEventListener('resize', resizeHandler);
