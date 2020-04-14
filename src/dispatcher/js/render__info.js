const InsertImages = imgDir => {
    const mapPath = '../resources/img/maps'
    const continer = document.querySelector('.map');
    const imgs = continer.querySelectorAll('img');

    console.log(imgDir);

    for(img of imgs)
    {
        const id = img.id;
        const path = `${mapPath}/${imgDir}/${id}.png`; 
        img.src = path; 
    }
};
const RenderInfo = report => {
    const desc = document.querySelector('#description');
    const time = document.querySelector('#time');
    const victims = document.querySelector('#victims');
    const addDang = document.querySelector('#additional-dangers');
    const addInf = document.querySelector('#additional-informations');

    const ffStatus = document.querySelector('#fire-fighters-status');
    const policeStatus = document.querySelector('#police-status');
    const ambulanceStatus = document.querySelector('#ambulance-status');

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

    if(services != null)
    {
        ffStatus.innerText = (services.fireFighters.requested) ? services.fireFighters.state : "not requested"; 
        policeStatus.innerText = (services.police.requested) ? services.police.state : "not requested"; 
        ambulanceStatus.innerText = (services.ambulance.requested) ? services.ambulance.state : "not requested"; 
    }
    else
    {
        ffStatus.innerText = 'not requested';
        policeStatus.innerText = 'not requested';
        ambulanceStatus.innerText = 'not requested';
    }
}

const RenderBuildingInfo = (adress, data) => {
    const buildingData = data.data;

    const div = document.querySelector('.top-content');

    if(div == null)
        return;

    let adressContainer = div.querySelector('.hies');
    adressContainer = adressContainer.querySelector('#building-address');
    const ul = div.querySelector('ul');
    const spans = ul.querySelectorAll('.building-info');

    adressContainer.innerText = adress;
    
    let index = 0;

    for(data in buildingData)
    {
        spans[index].innerText = ` ${buildingData[data]}`;
        index++;
    }
};

module.exports = {
    RenderInfo: report => {
        RenderInfo(report);
    },
    RenderBuildingInfo: (adress, data) => {
        RenderBuildingInfo(adress, data);
    },
    InsertImages: InsertImages
}