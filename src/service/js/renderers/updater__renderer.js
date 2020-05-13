const { ipcRenderer } = require('electron');

const text = document.querySelector('span');
const btn = document.querySelector('.legs button');

ipcRenderer.on('downloaded-update', (event, arg) => {
    text.innerText = 'Aktualizacja pobrana i gotowa do zainstalowania.';
    btn.classList.remove('btn--hidden');
});

btn.addEventListener('click', () => {
    ipcRenderer.send('install-update');
});