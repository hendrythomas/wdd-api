import { actions } from 'astro:actions';

class DrawingItem {
  constructor(menuId, title, drawing, isFinished, imageUrl = '', videoUrl = '') {
    this.menuId = menuId;
    this.title = title;
    this.drawing = drawing;
    this.isFinished = isFinished;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
  }
}

const drawingItems = [
  new DrawingItem('pics', 'Dog', null, false),
  new DrawingItem('pics', 'Cat', null, false),
  new DrawingItem('pics', 'Duck', null, false),
];

document.addEventListener('DOMContentLoaded', () => {
  populateMenu('pics');
});

document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'add-picture':
      addPicture(e);
      return;
    case 'add-blank':
      addItem('Blank', 'blank');
      return;
    case 'open-pic':
      openPic(e);
      return;
    case 'save-drawing':
      saveCanvas(e);
      closeDrawing(e);
      return;
    case 'close-drawing':
      closeDrawing(e);
      return;
  }
});

function populateMenu(menuId) {
  const menuElem = document.getElementById(menuId);
  if (menuElem === null) return;

  // clear menu
  const oldItems = menuElem.querySelector('[data-item]');
  for (const oldItem of oldItems || []) {
    menuElem.removeChild(oldItem);
  }
  
  // populate menu
  const items = drawingItems.filter(item => 
    item.menuId === menuId
  );
  for (const item of items) {
    addItem(item.title, item.isFinished, menuId);
  }
}

async function addPicture(e) {
  console.log('api test')
  await actions.apiTest();
  const title = 'Duck';
  addItem(title, 'pics');
}

function addItem(title, isFinished, menuId) {
  const templatePicsItemElems = document.getElementById('template-pics-item').content.children;
  if (templatePicsItemElems === null) return;

  const menuElem = document.getElementById(menuId);
  if (menuElem === null) return;

  const picsItemElem = templatePicsItemElems[0].cloneNode(true);
  if (!isFinished) {
    picsItemElem.classList.add('unfinished');
  }
  const titleText = picsItemElem.querySelector('[data-text="new-title"]');
  if (titleText !== null) {
    titleText.textContent = title;
  }

  menuElem.append(picsItemElem);
}

function openPic(e) {
}

function closeDrawing(e) {
  confirm('Close drawing?')
}

function saveCanvas(e) {}