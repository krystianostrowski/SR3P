const { app, BrowserWindow, globalShortcut, Menu } = require('electron');

let dispatcherWindow;
let serviceWindow;

const CreateWindow = () => {
    dispatcherWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#212121',
        autoHideMenuBar: true,
        title: "Dispatcher Window",
        webPreferences: {
            nodeIntegration: true
        }
    });

    serviceWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#212121',
        autoHideMenuBar: true,
        title: "Service Window",
        webPreferences: {
            nodeIntegration: true
        }
    });

    dispatcherWindow.loadFile('./html/dispatcher.html');
    serviceWindow.loadFile('./html/service.html');

    dispatcherWindow.webContents.openDevTools();
    serviceWindow.webContents.openDevTools();

    globalShortcut.register('f5', () => {
        dispatcherWindow.reload();
        serviceWindow.reload();
    });
};

app.on('ready', CreateWindow);