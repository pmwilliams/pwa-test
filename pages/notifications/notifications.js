import { 
  initPage
} from '../../common/init-page.js';

const MAX_VISIBLE_NOTIFICATIONS = 20;

initPage('../../');

navigator.serviceWorker.ready.then(registration => {
  registration.getNotifications().then(mergeNotifications)
  setInterval(() => registration.getNotifications().then(mergeNotifications), 1000);
});

const images = { 
  cloud: 'https://raw.githubusercontent.com/google/material-design-icons/master/png/file/cloud/materialiconsoutlined/48dp/2x/outline_cloud_black_48dp.png',
  favorite: 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/favorite_border/materialiconsoutlined/48dp/2x/outline_favorite_border_black_48dp.png', 
  thumb_up: 'https://raw.githubusercontent.com/google/material-design-icons/master/png/action/thumb_up/materialiconsoutlined/48dp/2x/outline_thumb_up_black_48dp.png',
};

const notifications = {};

const actions = {
  open: { action: 'open', title: 'Open' },
  explore: { action: 'explore', title: 'Explore' },
  dismiss: { action: 'dismiss', title: 'Dismiss' },
};

const app = document.querySelector('application-shell');

const onNotificationShow = (type) => app.alert(`${type} notification shown.`);

const onNotificationClick = (type, action, timestamp) => {
  const notification = notifications[timestamp];
  if (notification) {
    notification.action = action;
    if (action === 'dismiss') {
      notification.close();
    }
    redrawNotifications();
  }
  app.alert(`${type} notification clicked, action: ${action || 'n/a'}.`);
}

const onNotificationClose = (type, timestamp) => {
  if (timestamp && notifications[timestamp]) {
    notifications[timestamp].isClosed = true;
    redrawNotifications();
  }
  app.alert(`${type} notification closed.`)
};

const onNotificationError = (title, options, error) => {
  const timestamp = new Date().getTime();
  notifications[timestamp] = { title, timestamp, error, ...options };
  app.alert('An exception was thrown. Check notification list for details.');
}

const mergeNotifications = (toMerge) => {
  toMerge.forEach(notification => notifications[notification.timestamp] = notification);
  const toMergeMap = Object.fromEntries(toMerge.map(notification => [notification.timestamp, notification]));
  Object.values(notifications)
    .filter(notification => !notification.isLocal && !notification.error)
    .forEach(notification => notification.isClosed = Boolean(!toMergeMap[notification.timestamp]));
  redrawNotifications();
}

const redrawNotifications = () => {
  const list = document.querySelector('#notifications ul');
  Object.values(notifications)
    .slice(0, MAX_VISIBLE_NOTIFICATIONS)
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach(notification => {
      const existingItem = document.querySelector(`li[data-timestamp="${notification.timestamp}"]`)
      if (existingItem) {
        if (notification.isClosed) {
          existingItem.querySelector('.mdc-list-item__graphic i').classList.add('closed');
          existingItem.querySelector('.mdc-list-item__graphic i').textContent = "notifications_off"
        }
        if (notification.action) {
          existingItem.querySelector(`.notification-details .notification-action-${notification.action}`).classList.add('selected');
        }
      } else {
        const template = document.querySelector('#notification-item')
        var clone = template.content.cloneNode(true);
        const listItem = clone.querySelector('li')
        listItem.setAttribute('data-timestamp', notification.timestamp);
        listItem.addEventListener('click', () => {
          if (listItem.classList.contains('expanded')) {
            listItem.style.height = '48px'  
          } else {
            listItem.style.height = `${listItem.scrollHeight - 24}px`;
          }
          listItem.classList.toggle('expanded');
          
        });
        clone.querySelector('.notification-title').textContent = notification.title;
        clone.querySelector('.notification-body').textContent = notification.body;
        clone.querySelector('.notification-source').textContent = notification.isLocal ? 'Local' : 'Service Worker';
        clone.querySelector('.notification-time').textContent = displayTime(notification.timestamp);
        if (notification.isClosed) {
          clone.querySelector('.notification-status').classList.add('closed');
          clone.querySelector('.notification-status').textContent = "notifications_off"
        }
        if (notification.error) {
          clone.querySelector('.notification-status').classList.add('error');
          clone.querySelector('.notification-status').textContent = "priority_high"
        }
        if (!notification.icon) {
          clone.querySelector('.notification-details .notification-icon').classList.add('hide');
        }
        if (!notification.badge) {
          clone.querySelector('.notification-details .notification-badge').classList.add('hide');
        }
        if (!notification.image) {
          clone.querySelector('.notification-details .notification-image').classList.add('hide');
        }
        if (!notification.silent) {
          clone.querySelector('.notification-details .notification-silent').classList.add('hide');
        }
        if (!notification.requireInteraction) {
          clone.querySelector('.notification-details .notification-require-interaction').classList.add('hide');
        }
        if (!notification.renotify) {
          clone.querySelector('.notification-details .notification-renotify').classList.add('hide');
        }
        if (notification.dir) {
          clone.querySelector('.notification-details .notification-dir').textContent = notification.dir;
        } else {
          clone.querySelector('.notification-details .notification-dir').classList.add('hide');
        }
        if (!notification.actions.map(action => action.action).includes('open')) {
          clone.querySelector('.notification-details .notification-action-open').classList.add('hide');
        }
        if (!notification.actions.map(action => action.action).includes('explore')) {
          clone.querySelector('.notification-details .notification-action-explore').classList.add('hide');
        }
        if (!notification.actions.map(action => action.action).includes('dismiss')) {
          clone.querySelector('.notification-details .notification-action-dismiss').classList.add('hide');
        }
        if (notification.action) {
          clone.querySelector(`.notification-details .notification-action-${notification.action}`).classList.add('selected');
        }
        if (notification.error) {
          clone.querySelector('.notification-details .error-section').textContent = notification.error;
        }
        list.insertBefore(clone, list.firstChild);
      }
    })
  const items = list.querySelectorAll('li');
  if (items.length > MAX_VISIBLE_NOTIFICATIONS) {
    [...items].slice(MAX_VISIBLE_NOTIFICATIONS).forEach(child => child.remove());
  }
}

const showCreateNotification = () => {
  document.querySelector('.content').classList.add('create-notification');
}

const hideCreateNotification = () => {
  document.querySelector('.content').classList.remove('create-notification');
}

const notify = () => {
  Notification.requestPermission(result => {
    if (result === 'granted') {
      const newNotificationRadio = document.querySelector('#new-notification-radio');
      const titleTextField = document.querySelector('#notification-title');
      const tagTextField = document.querySelector('#notification-tag');
      const contentTextField = document.querySelector('#notification-content');
      const selectedIconChip = document.querySelector('#icon-chipset .mdc-chip--selected');
      const selectedBadgeChip = document.querySelector('#badge-chipset .mdc-chip--selected');
      const selectedImageChip = document.querySelector('#image-chipset .mdc-chip--selected');
      const selectedDirectionChip = document.querySelector('#direction-chipset .mdc-chip--selected');
      const silentCheckbox = document.querySelector('#silent-checkbox');
      const requireInteractionCheckbox = document.querySelector('#require-interaction-checkbox');
      const renotifyCheckbox = document.querySelector('#renotify-checkbox');
      const selectedActions = [...document.querySelectorAll('#actions-chipset .mdc-chip--selected')]
        .map(element => actions[element.getAttribute('data-value')]);
      const title = titleTextField.value;
      const options = { 
        tag: tagTextField.value,
        body: contentTextField.value,
        icon: selectedIconChip ? images[selectedIconChip.getAttribute('data-value')] : undefined,
        badge: selectedBadgeChip ? images[selectedBadgeChip.getAttribute('data-value')] : undefined,
        image: selectedImageChip ? images[selectedImageChip.getAttribute('data-value')] : undefined,
        dir: selectedDirectionChip ? selectedDirectionChip.getAttribute('data-value') : undefined,
        silent: silentCheckbox.checked,
        requireInteraction: requireInteractionCheckbox.checked,
        renotify: renotifyCheckbox.checked,
        actions: selectedActions
      };
      if (newNotificationRadio.checked) {
        try {
          const notification = new Notification(title, options);
          notification.onclick = (event) => onNotificationClick('Local', event.data?.action, event.data?.notification.timestamp);
          notification.onshow = () => onNotificationShow('Local');
          notification.onclose = (event) => onNotificationClose('Local', event.target.timestamp);
          notification.isLocal = true;
          notifications[notification.timestamp] = notification;
        } catch (error) {
          onNotificationError(title, options, error)
        }
        redrawNotifications();
      } else {
        navigator.serviceWorker.ready
          .then(registration => {
            registration.showNotification(title, options)
              .catch(error => onNotificationError(title, options, error));
            setTimeout(() => registration.getNotifications()
              .then(mergeNotifications), 200);
          });
      }
    }
  });
  document.querySelector('.content').classList.remove('create-notification');
  document.querySelector('#notifications').scrollIntoView({ behavior: 'smooth' })
}

navigator.serviceWorker.addEventListener('message', event => {
  switch (event.data.type) {
    case 'notificationclick': 
      onNotificationClick('Service Worker', event.data.action, event.data.timestamp);
      break;
    case 'notificationclose':
      onNotificationClose('Service Worker', event.data.timestamp);
      break;
    default:
      // Ignore anything else from service worker
  }
});

const displayTime = time => new Date(time).toLocaleTimeString('en-UK');

const isNotificationSupported = () => Boolean(window.Notification);
const isActionsSupported = () => Notification.prototype.hasOwnProperty('actions');
const isBadgeSupported = () => Notification.prototype.hasOwnProperty('badge');
const isBodySupported = () => Notification.prototype.hasOwnProperty('body');
const isCloseSupported = () => Notification.prototype.hasOwnProperty('close');
const isDataSupported = () => Notification.prototype.hasOwnProperty('data');
const isDirSupported = () => Notification.prototype.hasOwnProperty('dir');
const isIconSupported = () => Notification.prototype.hasOwnProperty('icon');
const isImageSupported = () => Notification.prototype.hasOwnProperty('image');
const isLangSupported = () => Notification.prototype.hasOwnProperty('lang');
const isMaxActionsSupported = () => Notification.hasOwnProperty('maxActions');
const isOnClickSupported = () => Notification.prototype.hasOwnProperty('onclick');
const isOnCloseSupported = () => Notification.prototype.hasOwnProperty('onclose');
const isOnErrorSupported = () => Notification.prototype.hasOwnProperty('onerror');
const isOnShowSupported = () => Notification.prototype.hasOwnProperty('onshow');
const isPermissionSupported = () => Notification.prototype.hasOwnProperty('permission');
const isRenotifySupported = () => Notification.prototype.hasOwnProperty('renotify');
const isRequestPermissionSupported = () => Notification.prototype.hasOwnProperty('requestPermission');
const isRequireInteractionSupported = () => Notification.prototype.hasOwnProperty('requireInteraction');
const isSilentSupported = () => Notification.prototype.hasOwnProperty('silent');
const isTagSupported = () => Notification.prototype.hasOwnProperty('tag');
const isTimestampSupported = () => Notification.prototype.hasOwnProperty('timestamp');
const isTitleSupported = () => Notification.prototype.hasOwnProperty('title');
const isVibrateSupported = () => Notification.prototype.hasOwnProperty('vibrate');
const isShowNotificationSupported = () => ServiceWorkerRegistration.prototype.hasOwnProperty('showNotification');

const getApi = () => ([
  { 
    name: 'window', 
    items: [
      { name: 'Notification', supported: isNotificationSupported() },
    ]
  },
  { 
    name: 'Notification', 
    items: [
      { name: '.actions', supported: isActionsSupported() },
      { name: '.badge', supported: isBadgeSupported() },
      { name: '.body', supported: isBodySupported() },
      { name: '.close', supported: isCloseSupported() },
      { name: '.data', supported: isDataSupported() },
      { name: '.dir', supported: isDirSupported() },
      { name: '.icon', supported: isIconSupported() },
      { name: '.image', supported: isImageSupported() },
      { name: '.lang', supported: isLangSupported() },
      { name: '.maxActions', supported: isMaxActionsSupported() },
      { name: '.onClick', supported: isOnClickSupported() },
      { name: '.onClose', supported: isOnCloseSupported() },
      { name: '.onError', supported: isOnErrorSupported() },
      { name: '.onShow', supported: isOnShowSupported() },
      { name: '.permission', supported: isPermissionSupported() },
      { name: '.renotify', supported: isRenotifySupported() },
      { name: '.requestPermission', supported: isRequestPermissionSupported() },
      { name: '.requireInteraction', supported: isRequireInteractionSupported() },
      { name: '.silent', supported: isSilentSupported() },
      { name: '.tag', supported: isTagSupported() },
      { name: '.timestamp', supported: isTimestampSupported() },
      { name: '.title', supported: isTitleSupported() },
      { name: '.vibrate', supported: isVibrateSupported() },
    ]
  },
  { 
    name: 'ServiceWorkerRegistration', 
    items: [
      { name: '.showNotification()', supported:  isShowNotificationSupported()},
    ]
  }
]);

document.querySelector('#notify-button').addEventListener('click', () => notify());
document.querySelector('#create-notification-fab').addEventListener('click', () => showCreateNotification());
document.querySelector('#close-create-notification').addEventListener('click', () => hideCreateNotification());

app.browserSupport = getApi();
