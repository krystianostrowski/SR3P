const { app, BrowserWindow, globalShortcut, ipcMain, autoUpdater, dialog } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const api = require('./js/sr3pAPI');
const path = require('path');

const server = 'http://krystian-ostrowski.webd.pro';
const feed = `${server}/update/sr3p`;

let dispatcherWindow;
let serviceWindow;

const WindowState = {
    SEARCH: 'search',
    INFO: 'info',
    FORM: 'form',
    BUILDINGINFO: 'buildingInfo'
}

let dispatcherWindowState = WindowState.SEARCH;

if(handleSquirrelEvent()) {
    return;
}

function handleSquirrelEvent() {
    if(process.argv.length === 1)
        return false;

    const ChildProcess = require('child_process');
    const squirrelEvents = process.argv[1];
    
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);
    
    const spawn = (command, args) => {
        let spawnedProcess, error;
    
        try
        {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        }
        catch(error) {}
    
        return spawnedProcess;
    };
    
    const spawnUpdate = args => {
        return spawn(updateDotExe, args);
    }
    
    switch(squirrelEvents)
    {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
    
            setTimeout(app.quit, 1000);
            return true;
    
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);
    
            setTimeout(app.quit, 1000);
            return true;
    
        case '--squirrel-obsolete':
            app.quit();
            return true;
    }  
};

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

    dispatcherWindow.loadFile('./html/updater.html');
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

    //----------------------------------------------

    globalShortcut.register('f1', () => {
        serviceWindow.loadFile('./html/service.html');
    });

    globalShortcut.register('f2', () => { 
        serviceWindow.loadFile('./html/service__map.html');
    });

    globalShortcut.register('f3', () => {
        serviceWindow.loadFile('./html/service__info.html');
    });

    //----------------------------------------------

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

    autoUpdater.setFeedURL(feed);
    autoUpdater.checkForUpdates();
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

        const building = api.GetBuildingInfo(arg);
        const dir = api.GetMapDir(building);

        dispatcherWindow.webContents.send('found-report', {report, dir});
    }
});

ipcMain.on('search-report-service', (event, arg) => {
    DebugLog(`Search: ${arg}`);

    const report = api.GetReport(arg);

    if(report == false)
    {   
        DebugLog('Report not found', LogTypes.ERROR);
        serviceWindow.webContents.send('report-not-found');
    }
    else 
    {
        DebugLog('Found report');
        serviceWindow.loadFile('./html/service__info.html');

        const building = api.GetBuildingInfo(arg);
        const dir = api.GetMapDir(building);

        serviceWindow.webContents.on('dom-ready', () => {
            serviceWindow.webContents.send('found-report', {report, dir });
        });
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
        dispatcherWindow.webContents.send('send-report-data', {report: arg.report, dir: arg.dir});
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

autoUpdater.on('update-available', () => {
    dispatcherWindow.loadFile('./html/updater.html');
    serviceWindow.loadFile('./html/updater.html');
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    dispatcherWindow.webContents.send('downloaded-update');
    serviceWindow.webContents.send('downloaded-update');
});

ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
});