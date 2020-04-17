const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const fetch = require('node-fetch');
const io = require('socket.io-client');
const path = require('path');
const url = require('url');

let window;
let bIsConnectedToServer;
let bCanConnectToAPI;
let bCanReceiveReport = true;

//TODO: Move to comfig file
const serverIP = '127.0.0.1';
const serverPort = 3000;
const API = `http://${serverIP}:${serverPort}/api`;

// const WindowState = {
//     SEARCH: 'search',
//     INFO: 'info',
//     FORM: 'form',
//     BUILDINGINFO: 'buildingInfo'
// }

// let dispatcherWindowState = WindowState.SEARCH;

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

//#endregion
//#region creating window
const CreateWindow = () => {
    window = new BrowserWindow({
        frame: false,
        width: 800,
        height: 600,
        resizable: false,
        x: 1000,
        y: 0,
        backgroundColor: '#212121',
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('./html/service.html');

    globalShortcut.register('f5', () => {
        window.reload();
        DebugLog('Reloaded window');
    });

    globalShortcut.register('f6', () => {
        window.webContents.openDevTools();
        DebugLog('Opened DevTools');
    });

    //#region dev shortcuts

    globalShortcut.register('f1', () => {
        window.loadFile('./html/service.html');
    });

    globalShortcut.register('f2', () => { 
        window.loadFile('./html/service__map.html');
    });

    globalShortcut.register('f3', () => {
        window.loadFile('./html/service__info.html');
    });

    //#endregion

    window.webContents.on('dom-ready', () => {
        GetDataFromAPI('getReports')
        .then(data => window.webContents.send('got-reports', data));
    });
};

app.on('ready', CreateWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin')
        app.quit();
});

app.allowRendererProcessReuse = false;
//#endregion
//#region connecting to the serverIP
DebugLog('Connecting to communication server.');
const socket = io(`http://${serverIP}:${serverPort}`);

socket.on('connect', () => {
    DebugLog(`Connected to communication server: http://${serverIP}:${serverPort}`);
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
ipcMain.on('search-report-service', (event, arg) => {
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
            window.loadFile('./html/service__info.html');

            GetDataFromAPI(`getBuildingInfo/${arg}`).then(building => {
                const dir = building.data.mapDir;

                window.webContents.on('dom-ready', () => {
                    window.webContents.send('found-report', {report, dir });
                });
            });
        }
    });
});

socket.on('request-sending-report', () => {
    if(bCanReceiveReport)
    {
        bCanReceiveReport = false;
        socket.emit('can-receive-report');
    }
});

socket.on('sending-report', data => {
    window.loadFile('./html/service__map.html');

    window.webContents.on('dom-ready', () => {
        window.webContents.send('sending-data', data);
    });
});

//TODO: confirmation of arrival

ipcMain.on('service-reached-destination', (event, arg) => {
    window.loadFile('./html/service__info.html');

    //TODO: Update status and send info to dispatcher
    //api.UpdateStatus(arg.id);
    arg.services.fireFighters.state = "na miejscu";

    //dispatcherWindow.webContents.send('send-report-data', arg);

    window.webContents.on('dom-ready', () => {
        window.webContents.send('receive-report', arg)
    });
}); 

ipcMain.on('home-button-clicked', (event, arg) => {
    //TODO: refactor
    if(arg === 'dispatcher')
    {
        dispatcherWindowState = WindowState.SEARCH;
        dispatcherWindow.loadFile('./dispatcher/html/dispatcher.html');
    }
    else if(arg === 'service')
    {
        window.loadFile('./html/service.html');
    }
});

//#endregion