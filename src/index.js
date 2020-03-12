const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const api = require('./js/sr3pAPI');

let dispatcherWindow;
let serviceWindow;

const WindowState = {
    SEARCH: 'search',
    INFO: 'info',
    FORM: 'form'
}

let dispatcherWindowState = WindowState.SEARCH;

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
    serviceWindow.loadFile('./html/service.html');

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

app.allowRendererProcessReuse = false;

ipcMain.on('search-report', (event, arg) => {
    DebugLog(`Search: ${arg}`, LogTypes.WARN);

    const report = api.GetReport(arg);

    if(report == false)
    {   
        DebugLog('Report not found');
        if(dispatcherWindowState != WindowState.SEARCH)
            dispatcherWindow.loadFile('./html/dispatcher.html');

        return;
    }
    else 
    {
        DebugLog('Found report');
        if(dispatcherWindowState != WindowState.INFO)
            dispatcherWindow.loadFile('./html/dispatcher__info.html');

        setTimeout(() => {
            dispatcherWindow.webContents.send('send-report-data', report);
        }, 5000)
        /*serviceWindow.webContents.send();*/
    }

    DebugLog(report.data.city);
});

ipcMain.on('open-dispatcher-form', () => {
    dispatcherWindowState = WindowState.FORM;
    dispatcherWindow.loadFile('./html/dispatcher__form.html');
});