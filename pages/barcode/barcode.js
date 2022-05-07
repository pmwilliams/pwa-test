import { initPage } from '../../common/init-page.js';

initPage('../../');

const app = document.querySelector('application-shell');

const onScanClick = () => {
  const video = document.querySelector('.video');
  const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13'] });

  const detect = () => {
    barcodeDetector.detect(video).then((barcodes) => {
      barcodes.forEach((barcode) => app.alert(`Barcode found: ${barcode.rawValue}`));
      window.requestAnimationFrame(detect);
    });
  };

  // Check if device has camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Start video stream
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: 'environment',
          },
        })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            window.requestAnimationFrame(() => {
              detect();
            });
          };
        });
    }
  }
};

document.querySelector('.scan').addEventListener('click', () => onScanClick());
