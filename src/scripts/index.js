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

const menuItems = [];

document.addEventListener('DOMContentLoaded', () => {
  updateMenuElem('pics');
  updateMenuElem('videos');
  updateMenuElem('camera');
  setUpSelectAddPic();
});

document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'open-pic':
      openPic(e);
      break;
    case 'save-drawing':
      saveCanvas(e);
      closeDrawing(e);
      break;
    case 'close-drawing':
      closeDrawing(e);
      break;
  }
});

function setUpSelectAddPic() {
  const selectAddPic = document.getElementById('select-add-pic');
  if (selectAddPic === null) return;

  const popoverSelectAddPic = document.getElementById('popover-select-add-pic');
  if (popoverSelectAddPic === null) return;

  popoverSelectAddPic.addEventListener('toggle', (e) => {
    // clear input
    selectAddPic.selectedIndex = 0;
  });
  
  selectAddPic.addEventListener('change', (e) => {
    addPicture(selectAddPic.selectedIndex);
    popoverSelectAddPic.hidePopover();
  });
}

async function addPicture(topicIndex) {
  const menuId = 'pics';

  // get image url
  let imageUrl;
  let title;
  if (topicIndex === 1) {
    const imageUrlResult = await actions.getDuckUrl();
    imageUrl = imageUrlResult.data;
    title = 'Duck';
  }
  else if (topicIndex === 2) {
    const imageUrlResult = await actions.getDogUrl();
    imageUrl = imageUrlResult.data;
    title = 'Dog';
  }
  else if (topicIndex === 3) {
    const imageUrlResult = await actions.getCatUrl();
    imageUrl = imageUrlResult.data;
    title = 'Cat';
  }
  else {
    return;
  }

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
  const itemElem = e.target.parentNode;
  if (itemElem === null) return;

  const index = itemElem.dataset.index;
  const item = menuItems[index];

  //TODO: close current canvas
  //TODO: create new canvas

  // set reference image
  const refImageElem = document.getElementById('refImage');
  if (refImageElem !== null) {
    refImageElem.src = item.imageUrl;
  }

  // set title
  const currentTitleElem = document.querySelector('[data-insert="current-title"]');
  if (currentTitleElem !== null) {
    currentTitleElem.textContent = item.title;
  }
}

function closeDrawing(e) {
  confirm('Close drawing?')
}

function saveCanvas(e) {}