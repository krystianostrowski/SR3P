const RenderInfo = report => {
    const desc = document.querySelector('#description');
    const time = document.querySelector('#time');
    const victims = document.querySelector('#victims');
    const addDang = document.querySelector('#additional-dangers');
    const addInf = document.querySelector('#additional-informations');

    const ffStatus = document.querySelector('#fire-fighters-status');
    const policeStatus = document.querySelector('#police-status');
    const ambulanceStatus = document.querySelector('#ambulance-status');

    const info = report.additionalInfo;

    desc.innerText = info.desc;
    time.innerText = info.time;

    //TODO: If victims are == null get people from building info

    victims.innerText = (info.victims == null) ? "TBA" : info.victims;
    addDang.innerText = info.dangers;
    addInf.innerText = info.info;

    const services = report.services;

    ffStatus.innerText = (services.fireFighters.requested) ? services.fireFighters.state : "not requested"; 
    policeStatus.innerText = (services.police.requested) ? services.police.state : "not requested"; 
    ambulanceStatus.innerText = (services.ambulance.requested) ? services.ambulance.state : "not requested"; 
}

module.exports = {
    RenderInfo: report => {
        RenderInfo(report);
    }
}