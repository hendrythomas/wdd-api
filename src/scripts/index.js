import { actions } from 'astro:actions';

class Drawing {
  constructor(menuId, title, piece, isFinished=false, refUrl='', videoUrl='') {
    this.menuId = menuId;
    this.title = title;
    this.piece = piece;
    this.isFinished = isFinished;
    this.refUrl = refUrl;
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
  listenUpload();
});

document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'open-drawing':
      openDrawing(e);
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
  
  canvasElem.addEventListener("mousemove", draw);
  canvasElem.addEventListener("mousedown", draw);
}

function listenUpload() {
  const uploadElem = document.querySelector('[data-do="upload-ref"] input[type="file"]');
  if (uploadElem === null) return;

  uploadElem.addEventListener("change", addPhoto);
}

function draw(e) {
  // left mouse button
  if (e.buttons !== 1) return;

  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;

  //TODO: adjust for element css size
  var canvasRect = canvasElem.getBoundingClientRect();
  const penX = e.clientX - canvasRect.left;
  const penY = e.clientY - canvasRect.top;

  const ctx = canvasElem.getContext('2d');
  ctx.rect(penX, penY, 2, 2);
  ctx.fill();
}

async function addPicture(topicIndex) {
  const menuId = 'pics';

  // get image url
  let refUrl;
  let title;
  if (topicIndex === 1) {
    const refUrlResult = await actions.getDuckUrl();
    refUrl = refUrlResult.data;
    title = 'Duck';
  }
  else if (topicIndex === 2) {
    const refUrlResult = await actions.getDogUrl();
    refUrl = refUrlResult.data;
    title = 'Dog';
  }
  else if (topicIndex === 3) {
    const refUrlResult = await actions.getCatUrl();
    refUrl = refUrlResult.data;
    title = 'Cat';
  }
  else {
    return;
  }

  // add drawing
  const newDrawing = new Drawing(
    menuId, title, null, false, refUrl
  );
  drawings.push(newDrawing);
  drawingsToStorage();

  // update ui early
  addItemElem(newDrawing, drawings.length - 1);
}

function addPhoto() {
  const uploadElem = document.querySelector('[data-do="upload-ref"] input[type="file"]');
  if (uploadElem === null) return;

  const file = uploadElem.files[0];
  if (file === undefined) return;

  // clear input
  uploadElem.value = null;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener('load', () => {
    // add drawing
    const newDrawing = new Drawing(
      'camera', 'Photo', null, false, reader.result
    );
    drawings.push(newDrawing);
    drawingsToStorage();

    // update ui early
    addItemElem(newDrawing, drawings.length - 1);
  });
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

function openDrawing(e) {
  if (currentDrawing !== noDrawing) {
    const doOpen = confirm('Current drawing will be closed. Continue?');
    if (!doOpen) return;
  }
  currentDrawing = noDrawing;

  const itemElem = e.target.parentNode;
  if (itemElem === null) return;

  const index = itemElem.dataset.index;
  const drawing = drawings[index];

  // set canvas
  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;

  if (drawing.piece === null) {
    canvas.width  = 400;
    canvas.height = 400;
  }

  currentDrawing = drawing;
  updateUi();
}

function saveDrawing() {
  if (currentDrawing === noDrawing) return;

  const canvasElem = document.getElementById('canvas');
  if (canvasElem === null) return;

  currentDrawing.piece = canvasElem.toDataURL();
  currentDrawing.isFinished = true;
  drawingsToStorage();

  //TODO: BUG PREVENTS CLOSE DRAWING
  // updateUi();
  
  closeDrawing();
}

function closeDrawing() {
  // only show prompt if drawing
  if (currentDrawing !== noDrawing) {
    const doClose = confirm('Close drawing?');
    if (!doClose) return;
  }

  currentDrawing = noDrawing;
  updateUi();
}

function deleteDrawing() {
  if (currentDrawing === noDrawing) return;

  const doDelete = confirm('Delete drawing?');
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
    refImageElem.src = currentDrawing.refUrl;
  }

  // set title
  const currentTitleElem = document.querySelector('[data-insert="current-title"]');
  if (currentTitleElem !== null) {
    currentTitleElem.textContent = currentDrawing.title;
  }

  // set canvas
  const canvasElem = document.getElementById('canvas');
  if (canvasElem !== null) {
    if (currentDrawing === noDrawing) {
      // clear canvas
      const ctx = canvasElem.getContext('2d');
      ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
    }
    else {
      if (currentDrawing.piece !== null) {
        const image = new Image();
        image.src = currentDrawing.piece;
        image.addEventListener('load', () => {
          canvas.width  = image.width;
          canvas.height = image.height;
          const ctx = canvasElem.getContext('2d');
          ctx.drawImage(image, 0, 0);
        });
      }
    }
  }
}

function drawingsToStorage() {
  const drawingsJson = JSON.stringify(drawings)
  localStorage.setItem("drawings", drawingsJson);
}

function storageToDrawings() {
  const storageDrawingsJson = localStorage.getItem("drawings");
  drawings = JSON.parse(storageDrawingsJson) || [];
}