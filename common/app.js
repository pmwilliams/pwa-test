const title = "Web API Explorer"

const routes = [
  { name: 'Home', path: 'index2.html', icon: 'home' },
  { name: 'Notifications', path: 'pages/notifications/notifications2.html', icon: 'notifications'},
  { name: 'Contacts', path: 'pages/contacts/contacts2.html', icon: 'contacts'},
  { name: 'Share', path: 'pages/share/share2.html', icon: 'share'},
]

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

export const initialiseApplicationShell = (relativePath) => {
  let tabBar;
  let menu;
  let snackbar;
  let drawer;
  let browserSupport = [];
  let alerts = [];

  const getNavLink = (route) => `<span class="mdc-list-item__ripple"></span>
      <i class="material-icons mdc-list-item__graphic" aria-hidden="true">${route.icon}</i>
      <span class="mdc-list-item__text">${route.name}</span>`

  const getFeatureItem = (feature) => {
    const iconClass = feature.supported ? '' : 'not-supported';
    const icon = feature.supported ? 'check_circle' : 'cancel';
    return `<span class="mdc-list-item__ripple"></span>
      <span class="mdc-list-item__text">
        <span class="mdc-list-item__primary-text">${feature.name}</span>
      </span>
      <span class="mdc-list-item__meta">
        <i class="material-icons mdc-list-item__graphic ${iconClass}" aria-hidden="true">${icon}</i>
      </span>`
  }

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${relativePath}/worker.js`);
    }
  }

  const initTabs = () => {
    tabBar = new window.mdc.tabBar.MDCTabBar(document.querySelector('.mdc-tab-bar'));
    tabBar.listen('MDCTabBar:activated', (activatedEvent) => {
      if (activatedEvent.detail.index === 1) {
        document.querySelector('.content-pane').classList.remove('tab-selected');
        document.querySelector('.browser-support').classList.add('tab-selected');
      } else {
        document.querySelector('.content-pane').classList.add('tab-selected');
        document.querySelector('.browser-support').classList.remove('tab-selected');
      }
    });
  }

  const initMenu = () => {
    menu = new window.mdc.menu.MDCMenu(document.querySelector('.mdc-menu'));
    menu.setAnchorCorner(window.mdc.menuSurface.Corner.BOTTOM_LEFT);
    document.querySelector('#menu-button').addEventListener('click', () => menu.open = true);
  }

  const initTitle = () => {
    document.querySelector('.mdc-top-app-bar__title').textContent = title;
  }

  const initNav = () => {
    const nav = document.querySelector('nav');
    routes.forEach(route => {
      const link = document.createElement('a');
      link.innerHTML = getNavLink(route);
      console.log(`${relativePath}/${route.path}`);
      link.setAttribute('href', `${relativePath}/${route.path}`);
      link.classList.add('mdc-list-item');
      if (window.location.href.endsWith(route.path)) {
        link.classList.add('mdc-list-item--activated');
        link.setAttribute('aria-current', 'page');
        link.tabIndex = 0;
      }
      nav.appendChild(link);
    })
  }

  const initSnackBar = () => {
    snackbar = new window.mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
    snackbar.listen('MDCSnackbar:closed', () => showNextAlert());
    showNextAlert();
  }

  const initDrawer = () => {
    drawer = window.matchMedia("(max-width: 1200px)").matches ?
        initModalDrawer() : initPermanentDrawer();
    
    const resizeHandler = () => { 
      if (window.matchMedia("(max-width: 1200px)").matches && drawer instanceof window.mdc.list.MDCList) {
        drawer.destroy();
        drawer = initModalDrawer();
      } else if (window.matchMedia("(min-width: 1200px)").matches && drawer instanceof window.mdc.drawer.MDCDrawer) {
        drawer.destroy();
        drawer = initPermanentDrawer();
      }
    }
    
    window.addEventListener('resize', resizeHandler);
  }

  const initPermanentDrawer = () => {
    const listElement = document.querySelector('.mdc-drawer .mdc-list');
    const drawerElement = document.querySelector('.mdc-drawer');

    drawerElement.classList.remove("mdc-drawer--modal");
    return new window.mdc.list.MDCList(listElement);
  }

  const initModalDrawer = () => {
    const topAppBarElement = document.querySelector('#app-bar');
    const listElement = document.querySelector('.mdc-drawer .mdc-list');
    const drawerElement = document.querySelector('.mdc-drawer');
    const mainContentElement = document.querySelector('main');

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

  const initTheme = () => {
    const setLightTheme = () => {
      document.body.classList.remove('dark');
      themeButton.textContent = 'dark_mode';
      localStorage.setItem('isDarkTheme', false);
    }
    const setDarkTheme = () => {
      document.body.classList.add('dark');
      themeButton.textContent = 'light_mode';
      localStorage.setItem('isDarkTheme', true);
    }
    const toggleTheme = () => {
      const isDarkTheme = localStorage.getItem('isDarkTheme') === 'true';
      if (isDarkTheme) {
        setLightTheme();  
      } else {
        setDarkTheme();
      }
    }
    const themeButton = document.querySelector('#theme-button');
    document.querySelector('#theme-button').addEventListener('click', toggleTheme);
    if (localStorage.getItem('isDarkTheme') === 'true') {
      setDarkTheme();
    }
  }

  const showNextAlert = () => {
    if (snackbar.isOpen || !alerts.length) {
      return
    }
    snackbar.labelText = alerts.shift();
    snackbar.actionButtonText = 'OK';
    snackbar.open();
  }

  const updateBrowserSupport = () => {
    const listElement = document.querySelector('#browser-support-list');
    listElement.innerHTML = '';
    if (browserSupport.length) {
      browserSupport.forEach(group => {
        const groupElement = document.createElement('div');
        groupElement.innerHTML = `<h5 class="mdc-list-group__subheader">${group.name}</h5>`
        groupElement.classList.add('mdc-list-group');
        group.items.forEach(feature => {
          const listItem = document.createElement('li');
          listItem.innerHTML = getFeatureItem(feature);
          listItem.classList.add('mdc-list-item');
          groupElement.appendChild(listItem);
        });
        listElement.appendChild(groupElement);
      });
      document.querySelector('main').classList.add("show-browser-support");
    }
  }

  const setBrowserSupport = (value) => {
    browserSupport = value;
    updateBrowserSupport();
  }
  
  const alert = (message) => {
    alerts.push(message);
    showNextAlert();
  }

  const showMenu = () => {
    drawer.open = true;
  }
  
  registerServiceWorker();
  initTheme();
  initTitle();
  initNav();
  initMenu();
  initTabs();
  initDrawer();
  initSnackBar();
  updateBrowserSupport();

  window.addEventListener('load', () => registerAndInit());

  document.documentElement.style.visibility = 'visible';

  return {
    setBrowserSupport,
    alert,
    showMenu,
  }
}
