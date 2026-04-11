import { actions } from 'astro:actions';

document.addEventListener('DOMContentLoaded', () => {
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

async function addPicture(e) {
  console.log('api test')
  await actions.apiTest();
  const title = 'Duck';
  addItem(title, 'pics');
}

function addItem(title, menuId) {
  const templatePicsItemElems = document.getElementById('template-pics-item').content.children;
  if (templatePicsItemElems === null) return;

  const menuElem = document.getElementById(menuId);
  if (menuElem === null) return;

  const picsItemElem = templatePicsItemElems[0].cloneNode(true);
  const titleText = picsItemElem.querySelector('[data-text="new-title"]');
  if (titleText !== null) {
    titleText.textContent = title;
  }

  menuElem.append(picsItemElem);
}

function openPic(e) {
  const currentTitleText = document.querySelector('[data-text="current-title"]');
  if (currentTitleText === undefined) return;

  const newTitleText = e.target.parentNode.querySelector('[data-text="new-title"]')
  if (newTitleText === undefined) return;

  currentTitleText.textContent = newTitleText.textContent;
}

function closeDrawing(e) {
  confirm('Close drawing?')
}

function saveCanvas(e) {}