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

const getApi = () => [
  {
    name: 'window',
    items: [{ name: 'Notification', supported: isNotificationSupported() }],
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
    ],
  },
  {
    name: 'ServiceWorkerRegistration',
    items: [{ name: '.showNotification()', supported: isShowNotificationSupported() }],
  },
];

const app = document.querySelector('application-shell');
app.apiSummary = getApi();
