const title = "Web API Explorer"

const routes = [
  { name: 'Home', path: 'index.html', icon: 'home' },
  { name: 'Notifications', path: 'pages/notifications/notifications.html', icon: 'notifications'},
  { name: 'Contacts', path: 'pages/contacts/contacts.html', icon: 'contacts'},
  { name: 'Share', path: 'pages/share/share.html', icon: 'share'},
]

const addLink = (parent, rel, href, onload) => {
  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', href);
  parent.appendChild(link);
  return link;
}

const addStylesheet = (parent, href) => {
  return addLink(parent, 'stylesheet', href);
}

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

class ApplicationShell extends HTMLElement {
  constructor() {
    super();
    this.shadowDom = this.attachShadow({mode:"open"});    
    this._browserSupport = [];
    this._alerts = [];

    document.documentElement.style.visibility = 'hidden';
  }

  set browserSupport(array) {
    this._browserSupport = array || [];
    this.updateBrowserSupport();
  }

  get browserSupport() {
    return this._browserSupport;
  }

  alert(message) {
    this._alerts.push(message);
    this.showNextAlert();
  }

  showMenu() {
    this.drawer.open = true;
  }

  connectedCallback() {
    this.addElementsToHead();
    this.initDomContent();
    this.initTheme();
    this.initTitle();
    this.initDrawer();      
    this.initBrowserSupport();
    document.documentElement.style.visibility = 'visible';
    
    window.addEventListener('DOMContentLoaded', () => {
      this.initNav();
      this.attachDrawer();
      this.attachMenu();
      this.attachTabs();
      this.attachSnackBar();
      this.updateBrowserSupport();
    });
  }

  addElementsToHead() {
    const relativePath = this.getAttribute('path');
    document.head.innerHTML += `
      <link rel="manifest" href="${relativePath}manifest.json">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

  initDomContent() {
    const relativePath = this.getAttribute('path');
    addStylesheet(this.shadowDom, `${relativePath}common/app-shell.css`);
    addStylesheet(this.shadowDom,"https://unpkg.com/material-components-web@13.0.0/dist/material-components-web.min.css");
    addStylesheet(this.shadowDom,"https://fonts.googleapis.com/icon?family=Material+Icons");
    this.shadowDom.innerHTML = this.shadowDom.innerHTML + html.replace('%relativePath%', relativePath);
  }

  initTitle() {
    const pageTitle = this.getAttribute('page-title');
    if (pageTitle) {
      document.title = `${title} | ${pageTitle}`;
    } else {
      document.title = title;
    }

    this.shadowDom.querySelector('.mdc-top-app-bar__title').textContent = title;
  }

  initNav() {
    const relativePath = this.getAttribute('path');
    const nav = this.shadowDom.querySelector('nav');
    routes.forEach(route => {
      const link = document.createElement('a');
      link.innerHTML = getNavLink(route);
      link.setAttribute('href', `${relativePath}${route.path}`);
      link.classList.add('mdc-list-item');
      if (window.location.href.endsWith(route.path)) {
        link.classList.add('mdc-list-item--activated');
        link.setAttribute('aria-current', 'page');
        link.tabIndex = 0;
      }
      nav.appendChild(link);
    })
  }

  initDrawer() {
    if (window.matchMedia("(max-width: 1200px)").matches) {
      this.shadowDom.querySelector('.mdc-drawer').classList.add("mdc-drawer--modal");
    } 
  }

  attachTabs() {
    this.tabBar = new window.mdc.tabBar.MDCTabBar(this.shadowDom.querySelector('.mdc-tab-bar'));
    this.tabBar.listen('MDCTabBar:activated', (activatedEvent) => {
      if (activatedEvent.detail.index === 1) {
        this.shadowDom.querySelector('.content-pane').classList.remove('tab-selected');
        this.shadowDom.querySelector('.browser-support').classList.add('tab-selected');
      } else {
        this.shadowDom.querySelector('.content-pane').classList.add('tab-selected');
        this.shadowDom.querySelector('.browser-support').classList.remove('tab-selected');
      }
    });
  }

  attachMenu() {
    this.menu = new window.mdc.menu.MDCMenu(this.shadowDom.querySelector('.mdc-menu'));
    this.menu.setAnchorCorner(window.mdc.menuSurface.Corner.BOTTOM_LEFT);
    this.shadowDom.querySelector('#menu-button').addEventListener('click', () => this.menu.open = true);
  }

  attachSnackBar() {
    this.snackbar = new window.mdc.snackbar.MDCSnackbar(this.shadowDom.querySelector('.mdc-snackbar'));
    this.snackbar.listen('MDCSnackbar:closed', () => this.showNextAlert());
    this.showNextAlert();
  }

  attachDrawer() {
    this.drawer = window.matchMedia("(max-width: 1200px)").matches ?
        this.attachModalDrawer() : this.attachPermanentDrawer();
    
    const resizeHandler = () => { 
      if (window.matchMedia("(max-width: 1200px)").matches && this.drawer instanceof window.mdc.list.MDCList) {
        this.drawer.destroy();
        this.drawer = this.attachModalDrawer();
      } else if (window.matchMedia("(min-width: 1200px)").matches && this.drawer instanceof window.mdc.drawer.MDCDrawer) {
        this.drawer.destroy();
        this.drawer = this.attachPermanentDrawer();
      }
    }
    
    window.addEventListener('resize', resizeHandler);
  }

  attachPermanentDrawer() {
    const listElement = this.shadowDom.querySelector('.mdc-drawer .mdc-list');
    const drawerElement = this.shadowDom.querySelector('.mdc-drawer');

    drawerElement.classList.remove("mdc-drawer--modal");
    return new window.mdc.list.MDCList(listElement);
  }

  attachModalDrawer() {
    const topAppBarElement = this.shadowDom.querySelector('#app-bar');
    const listElement = this.shadowDom.querySelector('.mdc-drawer .mdc-list');
    const drawerElement = this.shadowDom.querySelector('.mdc-drawer');
    const mainContentElement = this.shadowDom.querySelector('main');

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

  initTheme() {
    const setLightTheme = () => {
      document.body.classList.remove('dark');
      document.querySelector('application-shell').classList.remove('dark');
      themeButton.textContent = 'dark_mode';
      localStorage.setItem('isDarkTheme', false);
    }
    const setDarkTheme = () => {
      document.body.classList.add('dark');
      document.querySelector('application-shell').classList.add('dark');
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
    const themeButton = this.shadowDom.querySelector('#theme-button');
    this.shadowDom.querySelector('#theme-button').addEventListener('click', toggleTheme);
    if (localStorage.getItem('isDarkTheme') === 'true') {
      setDarkTheme();
    }
  }

  showNextAlert() {
    if (this.snackbar.isOpen || !this._alerts.length) {
      return
    }
    this.snackbar.labelText = this._alerts.shift();
    this.snackbar.actionButtonText = 'OK';
    this.snackbar.open();
  }

  initBrowserSupport() {
    if (this.hasAttribute('browser-support')) {
      this.shadowDom.querySelector('main').classList.add("show-browser-support");
    }
  }

  updateBrowserSupport() {
    const listElement = this.shadowDom.querySelector('#browser-support-list');
    listElement.innerHTML = '';
    if (this.browserSupport.length) {
      this.browserSupport.forEach(group => {
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
    }
  }
}

const html = `
  <header class="mdc-top-app-bar app-bar" id="app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
        <span class="mdc-top-app-bar__title"></span>
      </section>
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end">
        <div class="mdc-menu-surface--anchor">
          <button id="theme-button" class="material-icons mdc-icon-button">dark_mode</button>
          <button id="menu-button" class="material-icons mdc-icon-button">more_vert</button>
          <div class="mdc-menu mdc-menu-surface">
            <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
              <a class="mdc-list-item" href="https://github.com/pmwilliams/pwa-test" target="_blank" rel="noreferrer">
                <li class="mdc-list-item" role="menuitem">
                  <span class="mdc-list-item__ripple"></span>
                  <span class="mdc-list-item__text">Github</span>
                </li>
              </a>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </header>
  <div class="mdc-top-app-bar--fixed-adjust">
    <aside class="mdc-drawer">
      <div class="mdc-drawer__content">
        <nav class="mdc-list">
      </div>
    </aside>
    <div class="mdc-drawer-scrim"></div>
  </div>
  <aside class="mdc-snackbar">
    <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
      <div class="mdc-snackbar__label" aria-atomic="false">
        Can't send photo. Retry in 5 seconds.
      </div>
      <div class="mdc-snackbar__actions" aria-atomic="true">
        <button type="button" class="mdc-button mdc-snackbar__action">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Retry</span>
        </button>
      </div>
    </div>
  </aside>
  <main class="mdc-top-app-bar--fixed-adjust">
    <div class="mdc-tab-bar" role="tablist">
      <div class="mdc-tab-scroller">
        <div class="mdc-tab-scroller__scroll-area">
          <div class="mdc-tab-scroller__scroll-content">
            <button class="mdc-tab mdc-tab--active" role="tab" aria-selected="true" tabindex="0">
              <span class="mdc-tab__content">
                <span class="mdc-tab__icon material-icons" aria-hidden="true">explore</span>
                <span class="mdc-tab__text-label">explore</span>
              </span>
              <span class="mdc-tab-indicator mdc-tab-indicator--active">
                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
              </span>
              <span class="mdc-tab__ripple"></span>
            </button>
            <button class="mdc-tab" role="tab" aria-selected="true" tabindex="0">
              <span class="mdc-tab__content">
                <span class="mdc-tab__icon material-icons" aria-hidden="true">api</span>
                <span class="mdc-tab__text-label">Api</span>
              </span>
              <span class="mdc-tab-indicator">
                <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
              </span>
              <span class="mdc-tab__ripple"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="content-scroller">
      <div class="content-container">
        <div class="content-pane tab-selected">
          <slot><p>No page content<p></slot>
        </div>
        <aside class="browser-support">
          <ul id="browser-support-list" class="mdc-list">
        </aside>
      </div>
    </div>
  </main>
`
customElements.define('application-shell', ApplicationShell);
