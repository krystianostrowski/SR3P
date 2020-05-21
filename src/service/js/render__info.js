const { IP, Port } = require('../config.json');
const ImgPath = `http://${IP}:${Port}`;

const sInfo = document.querySelectorAll('.service-info');
const sElement = document.querySelectorAll('.services-element');
const ffStatus = sInfo[1];
const policeStatus = sInfo[2];
const ambulanceStatus = sInfo[0];

const fireFighters = sElement[1];
const police = sElement[2];
const ambulance = sElement[0];

const InsertImages = imgDir => {
    const continer = document.querySelector('.map');
    const imgs = continer.querySelectorAll('img');

    for(img of imgs)
    {
        const id = img.id;
        const path = `${ImgPath}/${imgDir}/service/${id}.png`; 
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

    if(report != null)
        info = report.additionalInfo;

    desc.innerText = (report == null) ? "" : info.desc;
    time.innerText = (report == null) ? "" : info.time;

    if(report != null)
        victims.innerText = (info.victims == null) ? "TBA" : info.victims;
    else
        victims.innerHTML = "";

    addDang.innerText = (report == null) ? "" : info.dangers;
    addInf.innerText = (report == null) ? "" : info.info;
}

const RenderBuildingInfo = data => {
    data = data.data;
    const age = document.querySelector('#age');
    const basement = document.querySelector("#basement");
    const heating = document.querySelector('#heating');
    const residents = document.querySelector("#residents");
    const gate = document.querySelector('#gates');
    const material = document.querySelector('#material');

    age.innerText = data.age;
    basement.innerHTML = data.basement;
    heating.innerHTML = data.heating;
    residents.innerHTML = data.residents;
    gate.innerHTML = data.wjazd;
    material.innerHTML = data.material;
};

const UpdateStatuses = report => {
    let services;

    if(report != null)
        services = report.services;
    else
        services = null;


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

