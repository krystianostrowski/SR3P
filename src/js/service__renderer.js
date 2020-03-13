const { ipcRenderer } = require('electron');

const confirmBtn = document.querySelector('#arrival-confirmation');

let bCanReceiveReport = true;
let report;

const RenderInfo = report => {
    const desc = document.querySelector('#description');
    const time = document.querySelector('#time');
    const victims = document.querySelector('#victims');
    const addDang = document.querySelector('#additional-dangers');
    const addInf = document.querySelector('#additional-informations');

    const ffStatus = document.querySelector('#fire-fighters-status');
    const policeStatus = document.querySelector('#police-status');
    const ambulanceStatus = document.querySelector('#ambulance-status');

    desc.innerText = "TBA";
    time.innerText = "TBA";
    victims.innerText = "TBA";
    addDang.innerText = "TBA";
    addInf.innerText = report;

    const services = report.services;

    console.log(ambulanceStatus);

    ffStatus.innerText = (services.fireFighters.requested) ? services.fireFighters.state : "not requested"; 
    policeStatus.innerText = (services.police.requested) ? services.police.state : "not requested"; 
    ambulanceStatus.innerText = (services.ambulance.requested) ? services.ambulance.state : "not requested"; 
}

ipcRenderer.on('request-sending-report', (event, arg) => {
    if(bCanReceiveReport)
        ipcRenderer.send('request-accepted', arg);
    else
        ipcRenderer.send('request-rejected');     
});

ipcRenderer.on('receive-report', (event, arg) => {
    bCanReceiveReport = false;
    RenderInfo(arg);
});

ipcRenderer.on('sending-data', (event, arg) => {
    report = arg;
});

if(confirmBtn != null)
{
    confirmBtn.addEventListener('click', () => {
        ipcRenderer.send('service-reached-destination', report);
    });
}