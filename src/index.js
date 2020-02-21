const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { DebugLog } = require('./js/debug');

let dispatcherWindow;
let serviceWindow;

const CreateWindow = () => {
    dispatcherWindow = new BrowserWindow({
        frame: false,
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        backgroundColor: '#212121',
        autoHideMenuBar: true,
        maximizable: false,
        title: "Dispatcher Window",
        webPreferences: {
            nodeIntegration: true
        }
    });

    serviceWindow = new BrowserWindow({
        frame: false,
        width: 800,
        height: 600,
        x: 1000,
        y: 0,
        backgroundColor: '#212121',
        autoHideMenuBar: true,
        maximizable: false,
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

    dispatcherWindow.on('closed', () => app.quit());
    serviceWindow.on('closed', () => app.quit());
};

app.on('ready', CreateWindow);

ipcMain.on('send__button--clicked', (e, args) => {
    dispatcherWindow.loadFile('./html/dispatcher__info.html');
    DebugLog('Send button clicked');
});