import { actions } from 'astro:actions';

class MenuItem {
  constructor(menuId, title, drawing, isFinished=false, imageUrl='', videoUrl='') {
    this.menuId = menuId;
    this.title = title;
    this.drawing = drawing;
    this.isFinished = isFinished;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
  }
}

const menuItems = [
  new MenuItem('pics', 'Dog', null),
  new MenuItem('videos', 'Cat', null),
  new MenuItem('camera', 'Duck', null),
];

document.addEventListener('DOMContentLoaded', () => {
  updateMenuElem('pics');
  updateMenuElem('videos');
  updateMenuElem('camera');
});

document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'add-picture':
      addPicture(e);
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

function updateMenuElem(menuId) {
  const menuElem = document.getElementById(menuId);
  if (menuElem === null) return;

  // empty menu
  const oldItems = menuElem.querySelectorAll('[data-item]');
  for (const oldItem of oldItems || []) {
    menuElem.removeChild(oldItem);
  }
  
  // populate menu
  const items = menuItems.filter(item => 
    item.menuId === menuId
  );
  for (const item of items) {
    //TODO: use index
    addItemElem(item, 1);
  }
}

async function addPicture(e) {
  await actions.apiTest();
  console.log('api test')

  const title = 'Duck';
  const newItem = new MenuItem(
    'pics', title, null
  );
  menuItems.push(newItem);
  const menuIndex = 1;
  addItemElem(newItem, menuIndex);
}

function addItemElem(newItem, menuIndex) {
  const TemplateMenuItemElems = document.getElementById('template-menu-item').content.children;
  if (TemplateMenuItemElems === null) return;

  const menuElem = document.getElementById(newItem.menuId);
  if (menuElem === null) return;

  const newItemElem = TemplateMenuItemElems[0].cloneNode(true);
  if (!newItem.isFinished) {
    newItemElem.classList.add('unfinished');
  }
  const titleText = newItemElem.querySelector('[data-insert="new-title"]');
  if (titleText !== null) {
    titleText.textContent = newItem.title;
  }
  newItemElem.dataset.menuIndex = menuIndex;

  menuElem.append(newItemElem);
}

function openPic(e) {
  // const currentTitleText = document.querySelector('[data-insert="current-title"]');
  // if (currentTitleText === undefined) return;

  // const newTitleText = e.target.parentNode.querySelector('[data-insert="new-title"]')
  // if (newTitleText === undefined) return;

  // currentTitleText.textContent = newTitleText.textContent;
}

function closeDrawing(e) {
  confirm('Close drawing?')
}

function saveCanvas(e) {}