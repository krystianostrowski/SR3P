const { app, BrowserWindow } = require('electron');

let window;

const CreateWindow = () => {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('./html/index.html');
    window.webContents.openDevTools();
}

app.whenReady().then(CreateWindow);