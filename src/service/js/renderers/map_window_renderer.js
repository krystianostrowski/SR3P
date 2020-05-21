const mapSwitch = document.querySelector(".map");
const infoSwitch = document.querySelector(".notificaton-info");
const infoWindow = document.querySelector(".notificaton-info-window");
const mapWindow = document.querySelector(".map-window");
const map = mapWindow.querySelector('.map-view');

const { IP, Port } = require('../config.json');

mapSwitch.addEventListener('click', () =>{
    mapSwitch.classList.add("map--active");
    infoSwitch.classList.remove("notificaton-info--active");
    infoWindow.classList.add("notificaton-info-window--inactive");
    mapWindow.classList.add("map-window--active");

});

infoSwitch.addEventListener('click',() =>{
    mapSwitch.classList.remove("map--active");
    infoSwitch.classList.add("notificaton-info--active");
    infoWindow.classList.remove("notificaton-info-window--inactive");
    mapWindow.classList.remove("map-window--active");
});

ipcRenderer.on('sending-data', (event, arg) => {
    const report = arg.report;
    const place = report.data;
    const info = report.additionalInfo;
    const ID = report.num;
    const reportID = document.querySelector('#report_id');
    const address = document.querySelector('#address');
    const time = document.querySelector('#time');
    const dangers = document.querySelector('#dangers');
    const victims = document.querySelector("#victims");
    const desc = document.querySelector('#desc');
    const infoNode = document.querySelector('#info');

    reportID.innerText = ID;
    address.innerText = `${place.city} ${place.street} ${place.building}`;
    time.innerText = info.time;
    dangers.innerText = info.dangers;
    victims.innerText = info.victims;
    desc.innerText = info.desc;
    infoNode.innerText = info.info;

    const img = document.createElement('img');

    img.src = `http://${IP}:${Port}/${arg.dir}/route.png`;

    map.appendChild(img);
});