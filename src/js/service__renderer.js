const { ipcRenderer } = require('electron');
const { RenderInfo } = require('../js/render__info');

const confirmBtn = document.querySelector('#arrival-confirmation');
const homeBtn = document.querySelector('.home');

let bCanReceiveReport = true;
let report;

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

if(homeBtn != null)
{
    homeBtn.addEventListener('click', () => {
        ipcRenderer.send('home-button-clicked', 'service');
    });
}