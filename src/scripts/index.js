import { actions } from 'astro:actions';

class Drawing {
  constructor(menuId, title, piece, isFinished=false, imageUrl='', videoUrl='') {
    this.menuId = menuId;
    this.title = title;
    this.piece = piece;
    this.isFinished = isFinished;
    this.imageUrl = imageUrl;
    this.videoUrl = videoUrl;
  }
}

let drawings = [];
const noDrawing = new Drawing(null, '', null);
let currentDrawing = noDrawing;

storageToDrawings();

document.addEventListener('DOMContentLoaded', () => {
  updateUi();
  listenSelectAddPic();
  listenCanvas();
});

document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'open-pic':
      openPic(e);
      break;
    case 'save-drawing':
      saveDrawing();
      break;
    case 'close-drawing':
      closeDrawing();
      break;
    case 'delete-drawing':
      deleteDrawing();
      break;
  }
});

function listenSelectAddPic() {
  const selectAddPicElem = document.getElementById('select-add-pic');
  if (selectAddPicElem === null) return;

  const selectAddPicPopover = document.getElementById('popover-select-add-pic');
  if (selectAddPicPopover === null) return;

  selectAddPicPopover.addEventListener('toggle', (e) => {
    // clear input
    selectAddPicElem.selectedIndex = 0;
  });
  
  selectAddPicElem.addEventListener('change', (e) => {
    addPicture(selectAddPicElem.selectedIndex);
    selectAddPicPopover.hidePopover();
  });
}

function listenCanvas() {
  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;
  
  canvasElem.addEventListener("mousedown", canvasTest);
}

function canvasTest(e) {
  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;

  const ctx = canvasElem.getContext('2d');
  ctx.rect(10, 10, 100, 100);
  ctx.fill();
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

  const newDrawing = new Drawing(
    menuId, title, null, false, imageUrl
  );
  drawings.push(newDrawing);
  drawingsToStorage();

  // update ui early
  addItemElem(newDrawing, drawings.length - 1);
}

function updateUi() {
  updateMenu('pics');
  updateMenu('videos');
  updateMenu('camera');
  updateMain();
}

function updateMenu(menuId) {
  const menuElem = document.getElementById(menuId);
  if (menuElem === null) return;

  // empty menu
  const oldDrawings = menuElem.querySelectorAll('[data-item]');
  for (const oldDrawing of oldDrawings || []) {
    menuElem.removeChild(oldDrawing);
  }
  
  // populate menu
  const menuDrawings = drawings.filter(drawing => 
    drawing.menuId === menuId
  );
  for (const drawing of menuDrawings) {
    addItemElem(drawing, drawings.indexOf(drawing));
  }
}

function updateMain() {
  // set reference image
  const refImageElem = document.getElementById('refImage');
  if (refImageElem !== null) {
    refImageElem.src = currentDrawing.imageUrl;
  }

  // set title
  const currentTitleElem = document.querySelector('[data-insert="current-title"]');
  if (currentTitleElem !== null) {
    currentTitleElem.textContent = currentDrawing.title;
  }
}

function addItemElem(drawing, index) {
  const templateMenuItemElems = document.getElementById('template-menu-item').content.children;
  if (templateMenuItemElems === null) return;

  const menuElem = document.getElementById(drawing.menuId);
  if (menuElem === null) return;

  const itemElem = templateMenuItemElems[0].cloneNode(true);
  if (!drawing.isFinished) {
    itemElem.classList.add('unfinished');
  }
  const titleText = itemElem.querySelector('[data-insert="new-title"]');
  if (titleText !== null) {
    titleText.textContent = drawing.title;
  }
  itemElem.dataset.index = index;

  menuElem.append(itemElem);
}

function openPic(e) {
  const itemElem = e.target.parentNode;
  if (itemElem === null) return;

  closeDrawing();

  // set canvas
  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;
  canvasElem.width  = 400;
  canvasElem.height = 400;

  const index = itemElem.dataset.index;
  const drawing = drawings[index];

  // update current drawing
  currentDrawing = drawing;
  updateUi();
}

function saveDrawing() {
  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;

  currentDrawing.piece = canvasElem.toDataURL();
  currentDrawing.isFinished = true;
  drawingsToStorage();

  updateUi();
  
  closeDrawing();
}

function closeDrawing() {
  // show prompt if drawing
  if (currentDrawing !== noDrawing) {
    const doClose = confirm('Close current drawing?')
    if (!doClose) return;
  }

  // clear canvas
  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;

  const ctx = canvasElem.getContext('2d');
  ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);

  // clear current drawing
  currentDrawing = noDrawing;
  updateUi();
}

function deleteDrawing() {
  const doDelete = confirm('Delete current drawing?');
  if (!doDelete) return;
  
  const index = drawings.indexOf(currentDrawing);
  if (index !== -1) {
    drawings.splice(index, 1);
  }
  drawingsToStorage();

  currentDrawing = noDrawing;
  updateUi();

  closeDrawing();
}

function drawingsToStorage() {
  const drawingsJson = JSON.stringify(drawings)
  localStorage.setItem("drawings", drawingsJson);
}

function storageToDrawings() {
  const storageDrawingsJson = localStorage.getItem("drawings");
  drawings = JSON.parse(storageDrawingsJson) || [];
}