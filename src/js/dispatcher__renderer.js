const { remote, ipcRenderer } = require('electron');

document.querySelector("#min-btn").addEventListener('click', () => {
    remote.getCurrentWindow().minimize();
});

document.querySelector("#max-btn").addEventListener('click', () => {
    const currentWindow = remote.getCurrentWindow();
    if (currentWindow.isMaximized()) {
        currentWindow.unmaximize();
    } else {
        currentWindow.maximize();
    }
});

document.querySelector("#close-btn").addEventListener('click', () => {
    remote.app.quit();
});