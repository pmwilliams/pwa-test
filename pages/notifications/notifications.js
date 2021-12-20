import { initPage, MDCDialog } from '../../common/init-page.js';

const MAX_VISIBLE_NOTIFICATIONS = 20;

initPage('../../');

const app = document.querySelector('application-shell');

const IMAGE_PREFIX = 'https://raw.githubusercontent.com/google/material-design-icons/master/png';

const images = {
  cloud: `${IMAGE_PREFIX}/file/cloud/materialiconsoutlined/48dp/2x/outline_cloud_black_48dp.png`,
  favorite: `${IMAGE_PREFIX}/action/favorite_border/materialiconsoutlined/48dp/2x/outline_favorite_border_black_48dp.png`,
  thumb_up: `${IMAGE_PREFIX}/action/thumb_up/materialiconsoutlined/48dp/2x/outline_thumb_up_black_48dp.png`,
};

const imageLookup = Object.fromEntries(Object.entries(images).map(([value, key]) => [key, value]));

const notifications = {};
const closedNotifications = {};

const actions = {
  open: { action: 'open', title: 'Open' },
  explore: { action: 'explore', title: 'Explore' },
  dismiss: { action: 'dismiss', title: 'Dismiss' },
};

const redrawNotifications = () => {
  const list = document.querySelector('#notifications ul');
  Object.values(notifications)
    .slice(0, MAX_VISIBLE_NOTIFICATIONS)
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach((notification) => {
      const existingItem = document.querySelector(`li[data-timestamp="${notification.timestamp}"]`);
      if (existingItem) {
        if (closedNotifications[notification.timestamp]) {
          existingItem.querySelector('.mdc-list-item__graphic i').classList.add('closed');
          existingItem.querySelector('.mdc-list-item__graphic i').textContent = 'notifications_off';
        }
      } else {
        const template = document.querySelector('#notification-item');
        const clone = template.content.cloneNode(true);
        clone.querySelector('li').setAttribute('data-timestamp', notification.timestamp);
        clone.querySelector('.notification-title').textContent = notification.title;
        clone.querySelector('.notification-body').textContent = notification.body;
        clone.querySelector('.notification-source').textContent = notification.isLocal ? 'Local' : 'Persistent';
        clone.querySelector('.notification-more-info').setAttribute('data-timestamp', notification.timestamp);
        if (notification.error) {
          clone.querySelector('.notification-status').classList.add('error');
          clone.querySelector('.notification-status').textContent = 'priority_high';
        }
        list.insertBefore(clone, list.firstChild);
      }
    });
  const items = list.querySelectorAll('li');
  if (items.length > MAX_VISIBLE_NOTIFICATIONS) {
    [...items].slice(MAX_VISIBLE_NOTIFICATIONS).forEach((child) => child.remove());
  }
};

const mergeNotifications = (toMerge) => {
  toMerge.forEach((notification) => {
    notifications[notification.timestamp] = notification;
  });
  const toMergeMap = Object.fromEntries(toMerge.map((notification) => [notification.timestamp, notification]));
  Object.values(notifications)
    .filter((notification) => !notification.isLocal && !notification.error)
    .filter((notification) => Boolean(!toMergeMap[notification.timestamp]))
    .forEach((notification) => {
      closedNotifications[notification.timestamp] = notification;
    });
  redrawNotifications();
};

const showCreateNotification = () => {
  document.querySelector('.content').classList.add('create-notification');
};

const hideCreateNotification = () => {
  document.querySelector('.content').classList.remove('create-notification');
};

const updateElementDisplay = (parent, selector, show) => {
  if (show) {
    parent.querySelector(selector).classList.remove('hide');
  } else {
    parent.querySelector(selector).classList.add('hide');
  }
};

const updateActionDisplay = (parent, notification, action) => {
  updateElementDisplay(
    parent,
    `.notification-action.${action}`,
    notification.actions.map((actionItem) => actionItem.action).includes(action)
  );
};

const updateMoreInfoDialog = (notification) => {
  const dialogElement = document.querySelector(`#more-info-dialog[data-timestamp="${notification.timestamp}"]`);
  if (!dialogElement) {
    return;
  }
  if (notification.action) {
    dialogElement.querySelector(`.notification-action.${notification.action}`).classList.add('mdc-chip--selected');
  }
  if (notification.error) {
    dialogElement.querySelector('.error-section').textContent = notification.error;
  } else {
    dialogElement.querySelector('.error-section').textContent = '';
  }
};

const showMoreInfoDialog = (event) => {
  if (!event.target.classList.contains('notification-more-info')) {
    return;
  }
  const timestamp = event.target.getAttribute('data-timestamp');
  const dialogElement = document.querySelector('#more-info-dialog');
  const notification = notifications[timestamp];
  dialogElement.setAttribute('data-timestamp', notification.timestamp);
  dialogElement.querySelector('#dialog-title').textContent = notification.title;
  dialogElement.querySelector('.notification-body').textContent = notification.body;
  updateElementDisplay(dialogElement, '.notification-tag', notification.tag);
  if (notification.tag) {
    dialogElement.querySelector('.notification-tag div').textContent = notification.tag;
  }
  updateElementDisplay(dialogElement, '.notification-icon', notification.icon);
  dialogElement.querySelector('.notification-icon i').textContent = imageLookup[notification.icon];
  updateElementDisplay(dialogElement, '.notification-badge', notification.badge);
  dialogElement.querySelector('.notification-badge i').textContent = imageLookup[notification.badge];
  updateElementDisplay(dialogElement, '.notification-image', notification.image);
  dialogElement.querySelector('.notification-image i').textContent = imageLookup[notification.image];
  updateElementDisplay(dialogElement, '.notification-silent', notification.silent);
  updateElementDisplay(dialogElement, '.notification-require-interaction', notification.requireInteraction);
  updateElementDisplay(dialogElement, '.notification-renotify', notification.renotify);
  updateElementDisplay(dialogElement, '.notification-dir', notification.dir);
  dialogElement.querySelector('.notification-dir div').textContent = notification.dir;
  updateActionDisplay(dialogElement, notification, 'open');
  updateActionDisplay(dialogElement, notification, 'explore');
  updateActionDisplay(dialogElement, notification, 'dismiss');
  updateMoreInfoDialog(notification);
  const dialog = new MDCDialog(dialogElement);
  dialog.open();
};

const onNotificationShow = (type) => app.alert(`${type} notification shown.`);

const onNotificationClick = (type, action, timestamp) => {
  const notification = notifications[timestamp];
  if (notification) {
    notification.action = action;
    if (action === 'dismiss') {
      notification.close();
    }
    redrawNotifications();
    updateMoreInfoDialog(notification);
  }
  app.alert(`${type} notification clicked, action: ${action || 'n/a'}.`);
};

const onNotificationClose = (type, timestamp) => {
  if (timestamp && notifications[timestamp]) {
    closedNotifications[timestamp] = notifications[timestamp];
    redrawNotifications();
  }
  app.alert(`${type} notification closed.`);
};

const onNotificationError = (title, options, error) => {
  const timestamp = new Date().getTime();
  notifications[timestamp] = {
    title,
    timestamp,
    error,
    ...options,
  };
  app.alert('An exception was thrown. Check notification list for details.');
};

const notify = () => {
  Notification.requestPermission((result) => {
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
      const selectedActions = [...document.querySelectorAll('#actions-chipset .mdc-chip--selected')].map(
        (element) => actions[element.getAttribute('data-value')]
      );
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
        actions: selectedActions,
      };
      if (newNotificationRadio.checked) {
        try {
          const notification = new Notification(title, options);
          notification.onclick = (event) =>
            onNotificationClick('Local', event.data?.action, event.data?.notification.timestamp);
          notification.onshow = () => onNotificationShow('Local');
          notification.onclose = (event) => onNotificationClose('Local', event.target.timestamp);
          notification.isLocal = true;
          notifications[notification.timestamp] = notification;
        } catch (error) {
          onNotificationError(title, options, error);
        }
        redrawNotifications();
      } else {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, options).catch((error) => onNotificationError(title, options, error));
          setTimeout(() => registration.getNotifications().then(mergeNotifications), 200);
        });
      }
    }
  });
  hideCreateNotification();
  document.querySelector('#notifications').scrollIntoView({ behavior: 'smooth' });
};

navigator.serviceWorker.addEventListener('message', (event) => {
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

document.querySelector('#notifications').addEventListener('click', showMoreInfoDialog);
document.querySelector('#notify-button').addEventListener('click', () => notify());
document.querySelector('#create-notification-fab').addEventListener('click', () => showCreateNotification());
document.querySelector('#close-create-notification').addEventListener('click', () => hideCreateNotification());

navigator.serviceWorker.ready.then((registration) => {
  registration.getNotifications().then(mergeNotifications);
  setInterval(() => registration.getNotifications().then(mergeNotifications), 1000);
});
