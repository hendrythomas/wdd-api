import { actions } from 'astro:actions';

document.addEventListener('DOMContentLoaded', () => {
});

document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'add-picture':
      addPicture(e);
      return;
    case 'add-blank':
      addBlank(e);
      return;
    case 'open-blank':
      openBlank(e);
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
}

function addBlank(e) {
  const title = 'Blank';
  
  const templatePicsItemElems = document.getElementById('template-pics-item').content.children;
  if (templatePicsItemElems === null) return;

  const picsElem = document.getElementById('blank');
  if (picsElem === null) return;

  const picsItemElem = templatePicsItemElems[0].cloneNode(true);
  const insertTitle = picsItemElem.querySelector('[data-insert="new-title"]');
  insertTitle.textContent = title;
  
  picsElem.append(picsItemElem);
}

function openBlank(e) {
  const insertTutorialName = document.querySelector('[data-insert="tutorial-name"]');
  if (insertTutorialName === undefined) return;

  insertTutorialName.textContent = 'Blank';
}

function closeDrawing(e) {
  confirm('Close drawing?')
}

function saveCanvas(e) {}