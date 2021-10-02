import { 
  registerAndInit
} from '../../common/mdc.js';


const initialiseOverviewCycle = () => {
  let overviewItemIndex;
  let isOverviewCyclePaused;
  let cycleInterval;
  const navItems = [...document.querySelectorAll('.overview-navigation ul li a')];
  const overviewItems = [...document.querySelectorAll('#overview > .overview-item')];
  
  const options = {
    root: document.querySelector('#overview'),
    rootMargin: '0px',
    threshold: 0.5
  }

  const onIntersection = (intersections) => {
    const intersecting = intersections.find(intersection => intersection.isIntersecting);
    overviewItemIndex = overviewItems.findIndex(item => item === intersecting.target);
    navItems.forEach(item => item.classList.remove('highlight'));
    navItems[overviewItemIndex].classList.add('highlight');
  }
  
  const overviewObserver = new IntersectionObserver(onIntersection, options);
  
  const onInterval = () => {
    if (isOverviewCyclePaused) {
      return;
    }
    overviewItemIndex = (overviewItemIndex + 1) % 3;
    overviewItems[overviewItemIndex].scrollIntoView();
  }

  const pauseCycle = () => {
    clearTimeout(isOverviewCyclePaused);
    isOverviewCyclePaused = setTimeout(() => isOverviewCyclePaused = undefined, 15000);
  }

  const startCycle = () => {
    if (cycleInterval) {
      return;
    }
    cycleInterval = setInterval(onInterval, 3000);
    overviewItems.forEach(item => overviewObserver.observe(item));
  }

  const stopCycle = () => {
    if (!cycleInterval) {
      return;
    }
    clearInterval(cycleInterval);
    cycleInterval = undefined;
    overviewItems.forEach(item => overviewObserver.unobserve(item));
  }
  
  navItems.forEach(item => item.addEventListener('mousedown', pauseCycle));
  document.querySelector('#overview').addEventListener('wheel', pauseCycle);
  document.querySelector('#overview').addEventListener('pointerdown', pauseCycle);

  if (window.matchMedia("(max-width: 600px)").matches) {
    startCycle()
  }

  window.addEventListener('resize', () => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      startCycle()
    } else {
      stopCycle();
    } 
  });
}

window.addEventListener('load', () => {
  registerAndInit();
  initialiseOverviewCycle();

  const app = document.querySelector('application-shell');
  document.querySelector('#get-started').addEventListener('click', () => app.showMenu());
});
