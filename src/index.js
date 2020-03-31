const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const api = require('./js/sr3pAPI');

let dispatcherWindow;
let serviceWindow;

const WindowState = {
    SEARCH: 'search',
    INFO: 'info',
    FORM: 'form',
    BUILDINGINFO: 'buildingInfo'
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

    api.CheckIfDBExists();
    DebugLog('Created windows');

    dispatcherWindow.webContents.on('dom-ready', () => {
        const cities = api.GetArrayOfCities();
        dispatcherWindow.webContents.send('got-cities', cities);
    });

    serviceWindow.webContents.on('dom-ready', () => {
        const reports = api.GetArrayOfReports();
        serviceWindow.webContents.send('got-reports', reports);
    });
};

app.on('ready', CreateWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit();
});

app.allowRendererProcessReuse = false;

ipcMain.on('search-report', (event, arg) => {
    DebugLog(`Search: ${arg}`);

    const report = api.GetReport(arg);

    if(report == false)
    {   
        DebugLog('Report not found', LogTypes.ERROR);
        dispatcherWindow.webContents.send('report-not-found');
    }
    else 
    {
        DebugLog('Found report');
        dispatcherWindow.webContents.send('found-report', report);
    }
});

ipcMain.on('search-building', (event, arg) => {
    const building = api.GetBuildingInfo(arg);

    if(!building)
    {
        if(dispatcherWindowState != WindowState.SEARCH)
        {
            dispatcherWindowState = WindowState.SEARCH;
            dispatcherWindow.loadFile('./html/dispatcher.html');
        }
        
        DebugLog('Building not found', LogTypes.ERROR);
    }
    else
    {
        if(dispatcherWindowState != WindowState.BUILDINGINFO)
        {
            dispatcherWindowState = WindowState.BUILDINGINFO;
            dispatcherWindow.loadFile('./html/dispatcher__place__info.html');

            dispatcherWindow.webContents.on('dom-ready', () => {
                dispatcherWindow.webContents.send('get-building-info', { buildingInfo: building, adress: arg });
            });
        }

        dispatcherWindow.webContents.send('get-building-info', { buildingInfo: building, adress: arg });

        DebugLog("Found building");
    }
});

ipcMain.on('display-dispatcher-info', (event, arg) => {
    if(dispatcherWindowState != WindowState.INFO)
    {
        dispatcherWindowState = WindowState.INFO;
        dispatcherWindow.loadFile('./html/dispatcher__info.html');
    }

    dispatcherWindow.webContents.on('dom-ready', () => {
        dispatcherWindow.webContents.send('send-report-data', arg);
    });
});

ipcMain.on('open-dispatcher-form', () => {
    dispatcherWindowState = WindowState.FORM;
    dispatcherWindow.loadFile('./html/dispatcher__form.html');
});

ipcMain.on('add-report-to-db', (event, arg) => {
    
    const report = api.AddReport(arg.data, arg.services, arg.additionalInfo);

    if(report == false)
    {
        //TODO: show error on screen
        DebugLog('Error while adding report to database', LogTypes.ERROR);
    }
    else
    {
        dispatcherWindowState = WindowState.INFO;
        dispatcherWindow.loadFile('./html/dispatcher__info.html');

        dispatcherWindow.webContents.on('dom-ready', () => {
            dispatcherWindow.webContents.send('send-report-data', report);
        });

        serviceWindow.webContents.send('request-sending-report', report);
    }
});

ipcMain.on('request-accepted', (event, arg) => {
    serviceWindow.loadFile('./html/service__map.html');

    serviceWindow.webContents.on('dom-ready', () => {
        serviceWindow.webContents.send('sending-data', arg);
    });
});

ipcMain.on('service-reached-destination', (event, arg) => {
    serviceWindow.loadFile('./html/service__info.html');

    api.UpdateStatus(arg.id);
    arg.services.fireFighters.state = "na miejscu";

    dispatcherWindow.webContents.send('send-report-data', arg);

    serviceWindow.webContents.on('dom-ready', () => {
        serviceWindow.webContents.send('receive-report', arg)
    });
}); 

ipcMain.on('home-button-clicked', (event, arg) => {

    if(arg === 'dispatcher')
    {
        dispatcherWindowState = WindowState.SEARCH;
        dispatcherWindow.loadFile('./html/dispatcher.html');
    }
    else if(arg === 'service')
    {
        serviceWindow.loadFile('./html/service.html');
    }
});