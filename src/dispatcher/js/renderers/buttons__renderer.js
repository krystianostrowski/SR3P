const plusBtn = document.querySelector('.plus');
const homeBtn = document.querySelector('.home');
const seeReportBtn = document.querySelector('#see-report');

if(plusBtn != null)
{
    plusBtn.addEventListener('click', () => {
        ipcRenderer.send('open-dispatcher-form');
    });
}

if(homeBtn != null)
{
    homeBtn.addEventListener('click', () => {
        ipcRenderer.send('home-button-clicked');
    });
}

if(seeReportBtn != null)
{
    seeReportBtn.addEventListener('click', () => {
        ipcRenderer.send('display-dispatcher-info', {report, dir});
    });
}


 ////------------------------------------------------------------
const locationBtn = document.querySelector("#open-location");

if(locationBtn != null)
{
    locationBtn.addEventListener('click', () => {
        const location = document.querySelector('.location');
        locationBtn.classList.toggle('open__location--active');
        location.classList.toggle('location--visible');
    });
}

const locationCloseBtn = document.querySelector("#close-location");
if(locationCloseBtn != null)
{
    locationCloseBtn.addEventListener('click', () => {
        const locationBtn = document.querySelector("#open-location");
        const location = document.querySelector('.location');
        location.classList.remove('location--visible');
        locationBtn.classList.remove('open__location--active');
        locationBtn.classList.toggle('open__location--inactive');

    });
}