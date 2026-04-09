document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    switch (e.target.id) {
      case 'open-blank':
        openBlank(e);
        return;
    }
  });
});


function openBlank(e) {
  const insertTutorialName = document.querySelector('[data-insert="tutorial-name"]');
  if (insertTutorialName === undefined) return;

  insertTutorialName.textContent = 'Dog';
}