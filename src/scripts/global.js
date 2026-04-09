document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const id = e.target.id;
    switch (id) {
      case 'open-blank':
        openBlank(e);
        return;
    }
  });
});

function openBlank(e) {
  console.log('yeaaaah')
}