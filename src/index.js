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
        resizable: true,
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
        resizable: true,
        x: 1000,
        y: 0,
        backgroundColor: '#212121',
        webPreferences: {
            nodeIntegration: true
        }
    });

    dispatcherWindow.loadFile('./html/dispatcher.html');
    serviceWindow.loadFile('./html/dispatcher__info.html');

    globalShortcut.register('f5', () => {
        dispatcherWindow.reload();
        serviceWindow.reload();
        DebugLog('Reloaded windows');
    });

    globalShortcut.register('f6', () => {
        dispatcherWindow.webContents.openDevTools();
        serviceWindow.webContents.openDevTools();
        DebugLog('Opened DevTools');
    });

    dispatcherWindow.on('closed', () => app.quit());
    serviceWindow.on('closed', () => app.quit());
};

app.on('ready', CreateWindow);

app.allowRendererProcessReuse = true;

ipcMain.on('search-report', (event, arg) => {
    DebugLog(`Search: ${arg}`, LogTypes.WARN);

    /*
        TODO: If found report load dispatcher__info.html
        and send data to dispatcherWindow and serviceWindow 
     */

    const report = api.GetReport(arg);

    console.log(report);

    /*dispatcherWindow.webContents.send();
    serviceWindow.webContents.send();*/
});