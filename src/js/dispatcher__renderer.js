const { ipcRenderer } = require('electron');

window.onload = () =>{
    const sendBtn = document.querySelector('#send');

    sendBtn.addEventListener('click', e => {
        ipcRenderer.send('send__button--clicked');
    });
}