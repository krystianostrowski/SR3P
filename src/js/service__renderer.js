const { ipcRenderer } = require('electron');
const { RenderInfo } = require('../js/render__info');

const confirmBtn = document.querySelector('#arrival-confirmation');
const searchBtn = document.querySelector('#service-search-button');

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

if(searchBtn != null)
{
    searchBtn.addEventListener('click', () => {
        const input = document.querySelector('.search__input');
        searchBtn.classList.toggle('search__button--active');
        searchBtn.classList.toggle('search__button--inactive');
        input.classList.toggle('search__input--visible');
    });
}