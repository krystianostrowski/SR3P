const { IP, Port } = require('../config.json');
const ImgPath = `http://${IP}:${Port}`;

const ffStatus = document.querySelector('#fire-fighters-status');
const policeStatus = document.querySelector('#police-status');
const ambulanceStatus = document.querySelector('#ambulance-status');

const ambulance = document.querySelector('.pogotowie');
const fireFighters = document.querySelector('.straz');
const police = document.querySelector('.policja');

const InsertImages = imgDir => {
    const continer = document.querySelector('.map');
    const imgs = continer.querySelectorAll('img');

    for(img of imgs)
    {
        const id = img.id;
        const path = `${ImgPath}/${imgDir}/${id}.png`; 
        img.src = path; 
    }
};

const RenderInfo = report => {
    const desc = document.querySelector('#description');
    const time = document.querySelector('#time');
    const victims = document.querySelector('#victims');
    const addDang = document.querySelector('#additional-dangers');
    const addInf = document.querySelector('#additional-informations');

    let info;
    let services;

    if(report != null)
        info = report.additionalInfo;

    if(report != null)
        services = report.services;
    else
        services = null;

    desc.innerText = (report == null) ? "" : info.desc;
    time.innerText = (report == null) ? "" : info.time;

    if(report != null)
        victims.innerText = (info.victims == null) ? "TBA" : info.victims;
    else
        victims.innerHTML = "";

    addDang.innerText = (report == null) ? "" : info.dangers;
    addInf.innerText = (report == null) ? "" : info.info;
};

const RenderBuildingInfo = (adress, data) => {
    const buildingData = data.data;

    const div = document.querySelector('.top-content');

    if(div == null)
        return;

    let adressContainer = div.querySelector('.hies');
    adressContainer = adressContainer.querySelector('#building-address');
    
    const spans = div.querySelectorAll('.building-info');

    adressContainer.innerText = adress;
    
    let index = 0;

    for(data in buildingData)
    {
        spans[index].innerText = `${buildingData[data]}`;
        index++;
    }
};

const UpdateStatuses = report => {
    const services = report.services;

    if(services != null)
    {
        if(services.fireFighters.requested)
        {

            ffStatus.innerText = '';
            const ids = services.fireFighters.ids;
            for(id of ids)
            {
                ffStatus.innerHTML += `${id.id}: ${id.status} <br>`;
            }

        }
        else
        {
            fireFighters.classList.add('service--hidden');
        }

        if(services.police.requested)
        {
            policeStatus.innerText = '';
            const ids = services.police.ids;

            for(id of ids)
            {
                policeStatus.innerHTML += `${id.id}: ${id.status} <br>`;
            }

        }
        else
        {
            police.classList.add('service--hidden');
        }

        if(services.ambulance.requested)
        {
            ambulanceStatus.innerText = '';
            const ids = services.ambulance.ids;

            for(id of ids)
            {
                ambulanceStatus.innerHTML += `${id.id}: ${id.status} <br>`;
            }

        }
        else
        {
            ambulance.classList.add('service--hidden');
        }

    }
    else
    {
        fireFighters.classList.add('service--hidden');
        police.classList.add('service--hidden');
        ambulance.classList.add('service--hidden');
    }
};
 
module.exports = {
    RenderInfo: report => {
        RenderInfo(report);
    },
    RenderBuildingInfo: (adress, data) => {
        RenderBuildingInfo(adress, data);
    },
    InsertImages: InsertImages,
    UpdateStatuses: UpdateStatuses
}