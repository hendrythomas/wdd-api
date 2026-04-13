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
  new MenuItem('pics', 'Cat', null),
  new MenuItem('videos', 'Duck', null),
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

async function addPicture(e) {
  const menuId = 'pics';
  const title = 'Duck';

  // get image url
  const imageUrlResult = await actions.getDuckUrl();
  const imageUrl = imageUrlResult.data;

  const newItem = new MenuItem(
    menuId, title, null, false, imageUrl
  );
  menuItems.push(newItem);

  // update ui early
  addItemElem(newItem, menuItems.length - 1);
}

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
    addItemElem(item, menuItems.indexOf(item));
  }
}

function addItemElem(newItem, index) {
  const templateMenuItemElems = document.getElementById('template-menu-item').content.children;
  if (templateMenuItemElems === null) return;

  const menuElem = document.getElementById(newItem.menuId);
  if (menuElem === null) return;

  const newItemElem = templateMenuItemElems[0].cloneNode(true);
  if (!newItem.isFinished) {
    newItemElem.classList.add('unfinished');
  }
  const titleText = newItemElem.querySelector('[data-insert="new-title"]');
  if (titleText !== null) {
    titleText.textContent = newItem.title;
  }
  newItemElem.dataset.index = index;

  menuElem.append(newItemElem);
}

function openPic(e) {
  const openItemElem = e.target.parentNode;
  if (openItemElem === null) return;

  const index = openItemElem.dataset.index;
  const openItem = menuItems[index];
  const imageUrl = openItem.imageUrl;

  const refImage = document.getElementById('refImage');
  if (refImage === null) return;

  refImage.src = imageUrl;
}

function closeDrawing(e) {
  confirm('Close drawing?')
}

function saveCanvas(e) {}