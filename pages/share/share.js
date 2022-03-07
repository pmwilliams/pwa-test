import { initPage } from '../../common/init-page.js';

initPage('../../');

let file;

const onFileSelected = (event) => {
  const image = document.querySelector('#file-display');
  [file] = event.target.files;
  image.src = URL.createObjectURL(file);

  document.querySelector('.no-share').classList.add('image-selected');
};

const onShareClicked = () => {
  navigator.share({
    files: [file],
  });
};

document.querySelector('#file-selector').addEventListener('change', onFileSelected);
document.querySelector('#share-button').addEventListener('click', onShareClicked);

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
    navigator.share = () => console.log('Shared!');
  } else {
    navigator.share = undefined;
  }
  updateApi();
});
