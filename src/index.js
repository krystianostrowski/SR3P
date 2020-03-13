const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const api = require('./js/sr3pAPI');

let dispatcherWindow;
let serviceWindow;

const WindowState = {
    SEARCH: 'search',
    INFO: 'info',
    FORM: 'form',
    ONTHEWAY: 'onTheWay',
    ATLOCATION: 'atLocation'
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

        dispatcherWindow.webContents.on('dom-ready', () => {
            dispatcherWindow.webContents.send('send-report-data', report);
        });
    }
});

ipcMain.on('open-dispatcher-form', () => {
    dispatcherWindowState = WindowState.FORM;
    dispatcherWindow.loadFile('./html/dispatcher__form.html');
});

ipcMain.on('add-report-to-db', (event, arg) => {
    
    const report = api.AddReport(arg.data, arg.services);

    DebugLog(report.data.city);

    if(report == false)
    {
        //TODO: Error while adding report to database - show error
    }
    else
    {
        dispatcherWindow.loadFile('./html/dispatcher__info.html');

        dispatcherWindow.webContents.on('dom-ready', () => {
            dispatcherWindow.webContents.send('send-report-data', report);
        });

        //TODO: Service window send data request
        serviceWindow.webContents.send('request-sending-report');
    }
});

ipcMain.on('request-accepted', () => {
    serviceWindow.loadFile('./html/service__map.html');
});

ipcMain.on('service-reached-destination', () => {
    serviceWindow.loadFile('./html/service__info.html');
}); 