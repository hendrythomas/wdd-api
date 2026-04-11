import { actions } from 'astro:actions';

document.addEventListener('DOMContentLoaded', () => {
});

document.addEventListener('click', (e) => {
  switch (e.target.dataset.do) {
    case 'open-blank':
      openBlank(e);
      return;
    case 'add-picture':
      addPicture(e);
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

function openBlank(e) {
  const insertTutorialName = document.querySelector('[data-insert="tutorial-name"]');
  if (insertTutorialName === undefined) return;

  insertTutorialName.textContent = 'Blank';
}

function closeDrawing(e) {
  confirm('Close drawing?')
}

function saveCanvas(e) {}