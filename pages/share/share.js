import { initPage } from '../../common/init-page.js';

initPage('../../');

let file;

const onFileSelected = (event) => {
  const image = document.querySelector('.share-image__display');
  [file] = event.target.files;
  image.classList.remove('share-image__display--loaded');
  image.onload = () => {
    image.classList.add('share-image__display--loaded');
  };
  image.src = URL.createObjectURL(file);

  document.querySelector('.select-image').classList.add('select-image--hidden');
  document.querySelector('.share-image').classList.add('share-image--visible');
};

const reset = () => {
  file = null;
  document.querySelector('.share-image__display').value = '';
  document.querySelector('.select-image').classList.remove('select-image--hidden');
  document.querySelector('.share-image').classList.remove('share-image--visible');
};

const onShareClicked = () => {
  navigator.share({
    files: [file],
  });
  reset();
};

const onCancelClicked = () => {
  reset();
};

document.querySelector('#file-selector').addEventListener('change', onFileSelected);
document.querySelector('.share-buttons__share').addEventListener('click', onShareClicked);
document.querySelector('.share-buttons__cancel').addEventListener('click', onCancelClicked);

const app = document.querySelector('application-shell');

const isShareSupported = () => Boolean(navigator.share);

const getApi = () => [
  {
    name: 'navigator',
    items: [{ name: '.share', supported: isShareSupported() }],
  },
];

const updateApi = () => {
  app.apiSummary = getApi();
};

if (!isShareSupported()) {
  app.enableStub = true;
}

updateApi();

app.addEventListener('stubChange', (event) => {
  if (event.detail.stub) {
    navigator.share = () => app.alert('Shared to stub api');
  } else {
    navigator.share = undefined;
  }
  updateApi();
});
