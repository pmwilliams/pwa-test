export const initialiseApplicationShell = (relativePath) => {
    const html = `
    <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href="${relativePath}style.css">
    <header class="mdc-top-app-bar app-bar" id="app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
        <span class="mdc-top-app-bar__title">PWA Test</span>
      </section>
    </div>
    </header>
    <div class="mdc-top-app-bar--fixed-adjust">
      <aside class="mdc-drawer">
        <div class="mdc-drawer__content">
          <nav class="mdc-list">
            <a class="mdc-list-item mdc-list-item--activated" href="${relativePath}/index.html" aria-current="page" tabindex="0">
              <span class="mdc-list-item__ripple"></span>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">home</i>
              <span class="mdc-list-item__text">Home</span>
            </a>
            <a class="mdc-list-item" href="${relativePath}pages/notifications/notifications.html">
              <span class="mdc-list-item__ripple"></span>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">notifications</i>
              <span class="mdc-list-item__text">Notifications</span>
            </a>
            <a class="mdc-list-item" href="${relativePath}pages/contacts/contacts.html">
              <span class="mdc-list-item__ripple"></span>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">contacts</i>
              <span class="mdc-list-item__text">Contacts</span>
            </a>
            <a class="mdc-list-item" href="${relativePath}pages/share/share.html">
              <span class="mdc-list-item__ripple"></span>
              <i class="material-icons mdc-list-item__graphic" aria-hidden="true">share</i>
              <span class="mdc-list-item__text">Share</span>
            </a>
          </nav>
        </div>
      </aside>
      <div class="mdc-drawer-scrim"></div>
    </div>
    <main class="main-content mdc-top-app-bar--fixed-adjust">
      <slot><p>No page content<p></slot>
    </main>
  `;
  
  const template = document.createElement('template');
  template.id = 'application-shell'
  template.innerHTML = html;
  document.body.appendChild(template);

  class ApplicationShell extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.shadowDom = this.attachShadow({mode:"open"});
      
      const template = document.getElementById('application-shell');
      this.shadowDom.appendChild(template.content.cloneNode(true));

      const initModalDrawer = () => {
        const topAppBarElement = this.shadowDom.querySelector('#app-bar');
        const listElement = this.shadowDom.querySelector('.mdc-drawer .mdc-list');
        const drawerElement = this.shadowDom.querySelector('.mdc-drawer');
        const mainContentElement = this.shadowDom.querySelector('.main-content');

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
        const listElement = this.shadowDom.querySelector('.mdc-drawer .mdc-list');
        const drawerElement = this.shadowDom.querySelector('.mdc-drawer');

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
    }
  }

  customElements.define('application-shell', ApplicationShell);
}
