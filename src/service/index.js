const { app, BrowserWindow, globalShortcut, ipcMain, autoUpdater } = require('electron');
const { DebugLog, LogTypes } = require('./js/debug');
const { IP, Port, UpdateServer, ID } = require('./config.json');
const fetch = require('node-fetch');
const io = require('socket.io-client');
const path = require('path');

let window;
let bIsConnectedToServer;
let bCanConnectToAPI;
let bCanReceiveReport = true;

let reportID;

const bDev = true;

const API = `http://${IP}:${Port}/api`;

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
        resizable: true,
        x: 1000,
        y: 0,
        backgroundColor: '#121212',
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
        GetDataFromAPI('getCities')
        .then(data => {
            //console.log(data);
            window.webContents.send('got-places', data);
        });
    });

    if(!bDev)
    {
        autoUpdater.setFeedURL(UpdateServer);
        autoUpdater.checkForUpdates();
    }
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
const socket = io(`http://${IP}:${Port}`);

socket.on('connect', () => {
    DebugLog(`Connected to communication server: http://${IP}:${Port}`);
    DebugLog(`Client id: ${socket.id}`);

    socket.emit('register-client', ID);

    bIsConnectedToServer = true;
});

socket.on('disconnect', () => {
    DebugLog('Disconnected from communication server', LogTypes.WARN);
    DebugLog('Disconnected from API', LogTypes.WARN);

    bIsConnectedToServer = false;
    bCanConnectToAPI = false;

    app.quit();
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
    if(!bCanConnectToAPI)
        return;

    DebugLog(`Search: ${arg}`);

    /*GetDataFromAPI(`getReport/${arg}`).then(report => {
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
    });*/
    GetDataFromAPI(`getReportsArray/${arg}`).then(reports => {
        if(!reports.length)
        {
            DebugLog('Report not found', LogTypes.ERROR);
            window.webContents.send('report-not-found');
        }
        else
        {
            DebugLog('Found report');
            window.loadFile('./html/notification__list.html');

            window.webContents.on('dom-ready', () => {
                window.webContents.send('render-reports-table', reports);
            });
        }
    }); 
});

// socket.on('request-sending-report', () => {
//     if(bCanReceiveReport && bIsConnectedToServer)
//     {
//         bCanReceiveReport = false;
//         socket.emit('can-receive-report');
//     }
// });

socket.on('sending-report', data => {
    GetDataFromAPI(`getReportByID/${data}`).then(report => {

        socket.emit('get-route', report);
    });
});

socket.on('got-route', data => {
    window.loadFile('./html/service__map.html');

    window.webContents.on('dom-ready', () => {
        window.webContents.send('sending-data', { report: data.report, dir: data.dir });
        reportID = data.report.id;
    });
});

socket.on('update-info', id => {
    GetDataFromAPI(`getReportByID/${id}`).then(report =>{
        window.webContents.send('update-info', report);
    });
});

ipcMain.on('service-reached-destination', () => {

    socket.emit('update-service-status', { reportID: reportID, serviceID: ID, status: "na miejscu" });

    GetDataFromAPI(`getReportByID/${reportID}`).then(report => {
        const data = report.data;
        const address = `${data.city}, ${data.street} ${data.building}`;

        GetDataFromAPI(`getBuildingInfo/${address}`).then(building => {
            window.loadFile('./html/service__info.html');

            window.webContents.on('dom-ready', () => {
                window.webContents.send('render-report', { report: report, building: building });
            });
        });
    });
}); 

ipcMain.on('get-report-data', (event, arg) => {
    reportID = arg;
    GetDataFromAPI(`getReportByID/${arg}`).then(data => {
        const buildingData = data.data;
        const address = `${buildingData.city}, ${buildingData.street} ${buildingData.building}`;

        GetDataFromAPI(`getBuildingInfo/${address}`).then(building => {
            window.loadFile('./html/service__info.html');

            window.webContents.on('dom-ready', () => {
                window.webContents.send('render-report', { report: data, building: building });
            });
        });
    });
});

ipcMain.on('close-report', () => {
    //TODO: update report status
    socket.emit('update-service-status', { reportID: reportID, serviceID: ID, status: "zakończono" });
    window.loadFile('./html/service.html');
});

ipcMain.on('home-button-clicked', () => {
        window.loadFile('./html/service.html');
});

autoUpdater.on('update-available', () => {
    window.loadFile('./html/updater.html');
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    window.webContents.send('downloaded-update');
});

ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
});
//#endregion