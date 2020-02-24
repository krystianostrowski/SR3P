const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const api = require('./js/sr3pAPI');

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
        webPreferences: {
            nodeIntegration: true
        }
    });

    dispatcherWindow.loadFile('./html/dispatcher.html');
    serviceWindow.loadFile('./html/service.html');

    globalShortcut.register('f5', () => {
        dispatcherWindow.reload();
        serviceWindow.reload();
    });

    globalShortcut.register('f6', () => {
        dispatcherWindow.webContents.openDevTools();
        serviceWindow.webContents.openDevTools();
    });

    dispatcherWindow.on('closed', () => app.quit());
    serviceWindow.on('closed', () => app.quit());
};

app.on('ready', CreateWindow);

ipcMain.on('send__button--clicked', (e, args) => {
    dispatcherWindow.loadFile('./html/dispatcher__info.html');
    DebugLog('Send button clicked');
    const city = api.GetCity('');
    const street = api.GetStreet(city, '');
    const building = api.GetBuilding(street, 0);
});