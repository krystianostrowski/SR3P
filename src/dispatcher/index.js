const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const { IP, Port } = require('./config.json');
const fetch = require('node-fetch');
const io = require('socket.io-client');
const path = require('path');

let window; 
let windowState;
let bIsConnectedToServer;
let bCanConnectToAPI;

const API = `http://${IP}:${Port}/api`;

const Sate = {
    SEARCH: 'search',
    INFO: 'info',
    FORM: 'form',
    BUILDINGINFO: 'buildingInfo'
};

const GetDataFromAPI = async (path) => {
    try {
        const response = await fetch(new URL(`${API}/${path}`));
        const data = await response.json();

        return data;
    } catch (err) {
        DebugLog(err, LogTypes.ERROR);
    }
};

//#region squirrel/updater

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
        catch(error) {
            return DebugLog(error, LogTypes.ERROR);
        }
    
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

//#endregion
//#region creating window
const CreateWindow = () => {
    window = new BrowserWindow({
        frame: false,
        width: 800,
        height: 600,
        resizable: true,
        x: 0,
        y: 0,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('./html/dispatcher.html');
    windowState = Sate.SEARCH;

    globalShortcut.register('f5', () => {
        window.reload();
        DebugLog('Reloaded window.');
    });

    globalShortcut.register('f6', () => {
        window.webContents.openDevTools();
        DebugLog('Opened DevTools');
    });

    //#region dev shortcuts

    globalShortcut.register('f1', () => {
        serviceWindow.loadFile('./html/dispatcher.html');
    });

    globalShortcut.register('f2', () => { 
        serviceWindow.loadFile('./html/dispatcher__form.html');
    });

    globalShortcut.register('f3', () => {
        serviceWindow.loadFile('./html/dispatcher__info.html');
    });

    globalShortcut.register('f4', () => {
        serviceWindow.loadFile('./html/dispatcher__place__info.html');
    });

    //#endregion

    window.webContents.on('dom-ready', () => {
        GetDataFromAPI('getCities')
        .then(response => window.webContents.send('got-cities', response));
    });

}

app.on('ready', CreateWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit();
});

app.allowRendererProcessReuse = false;
//#endregion
//#region connection to the server
DebugLog('Connecting to communication server.');
const socket = io(`http://${IP}:${Port}`);

socket.on('connect', () => {
    DebugLog(`Connected to communication server: http://${IP}:${Port}`);
    DebugLog(`Client id: ${socket.id}`);

    bIsConnectedToServer = true;
});

socket.on('disconnect', () => {
    DebugLog('Disconnected from communication server', LogTypes.WARN);
    DebugLog('Disconnected from API', LogTypes.WARN);

    bIsConnectedToServer = false;
    bCanConnectToAPI = false;
});

GetDataFromAPI('connection').then(response => {
    if(response === true)
    {
        DebugLog('Connected to API');
        bCanConnectToAPI = true;
    }
    else
    {
        DebugLog('Couldn\'t connect to API', LogTypes.ERROR);
        bCanConnectToAPI = false;
    }
});
//#endregion

//#region events
ipcMain.on('search-report', (event, arg) => {
    DebugLog(`Search: ${arg}`);

    GetDataFromAPI(`getReport/${arg}`).then(report => {
        if(report == false)
        {   
            DebugLog('Report not found', LogTypes.ERROR);
            window.webContents.send('report-not-found');
        }
        else 
        {
            DebugLog('Found report');

            GetDataFromAPI(`getBuildingInfo/${arg}`).then(response => {
                const dir = response.data.mapDir;
                
                window.webContents.send('found-report', {report, dir});
            });
        }
    });
});

ipcMain.on('search-building', (event, arg) => {
    GetDataFromAPI(`getBuildingInfo/${arg}`).then(building => {
        if(!building)
        {
            if(windowState != Sate.SEARCH)
            {
                windowState = Sate.SEARCH;
                window.loadFile('./html/dispatcher.html');
            }
            
            DebugLog('Building not found', LogTypes.ERROR);
        }
        else
        {
            if(windowState != Sate.BUILDINGINFO)
            {
                windowState = Sate.BUILDINGINFO;
                window.loadFile('./html/dispatcher__place__info.html');

                window.webContents.on('dom-ready', () => {
                    window.webContents.send('get-building-info', { buildingInfo: building, adress: arg });
                });
            }

            window.webContents.send('get-building-info', { buildingInfo: building, adress: arg });

            DebugLog("Found building");
        }
    });
});

ipcMain.on('display-dispatcher-info', (event, arg) => {
    if(windowState != Sate.INFO)
    {
        windowState = Sate.INFO;
        window.loadFile('./html/dispatcher__info.html');
    }

    window.webContents.on('dom-ready', () => {
        window.webContents.send('send-report-data', {report: arg.report, dir: arg.dir});
    });
});

ipcMain.on('open-dispatcher-form', () => {
    windowState = Sate.FORM;
    window.loadFile('./html/dispatcher__form.html');
});

ipcMain.on('add-report-to-db', (event, arg) => {
    socket.emit('add-report', arg);
});

socket.on('added-report', report => {
    if(report == false)
    {
        //TODO: show error on screen
        DebugLog('Error while adding report to database', LogTypes.ERROR);
    }
    else
    {
        windowState = Sate.INFO;
        window.loadFile('./html/dispatcher__info.html');

        window.webContents.on('dom-ready', () => {
            window.webContents.send('send-report-data', report);
        });
    }
});

ipcMain.on('home-button-clicked', (event, arg) => {

    if(arg === 'dispatcher')
    {
        windowState = Sate.SEARCH;
        window.loadFile('./html/dispatcher.html');
    }
    else if(arg === 'service')
    {
        window.loadFile('./service/html/service.html');
    }
});
//#endregion