import { initPage } from '../../common/init-page.js';

initPage('../../');

const app = document.querySelector('application-shell');

const onScanClick = () => {
  const video = document.querySelector('.video');
  const canvas = document.querySelector('.overlay');
  const ctx = canvas.getContext('2d');
  const barcodeDetector = new window.BarcodeDetector({ formats: ['ean_13'] });

  const draw = (boundingBox) => {
    const xRatio = video.clientWidth / video.videoWidth;
    const yRatio = video.clientHeight / video.videoHeight;
    ctx.beginPath();
    ctx.rect(boundingBox.x * xRatio, boundingBox.y * yRatio, boundingBox.width * xRatio, boundingBox.height * yRatio);
    ctx.lineWidth = '1';
    ctx.strokeStyle = 'red';
    ctx.stroke();
  };

  const detect = () => {
    barcodeDetector.detect(video).then((barcodes) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      barcodes.forEach((barcode) => {
        app.alert(`Barcode found: ${barcode.rawValue}`);
        draw(barcode.boundingBox);
      });
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
