const { ipcRenderer } = require('electron');

const confirmBtn = document.querySelector('#arrival-confirmation');

let bCanReceiveReport = true;

ipcRenderer.on('request-sending-report', () => {
    if(bCanReceiveReport)
        ipcRenderer.send('request-accepted');
    else
        ipcRenderer.send('request-rejected');     
});

ipcRenderer.on('receive-report', () => {
    bCanReceiveReport = false;
});

if(confirmBtn != null)
{
    confirmBtn.addEventListener('click', () => {
        ipcRenderer.send('service-reached-destination');
    });
}