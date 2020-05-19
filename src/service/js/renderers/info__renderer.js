const infoSwitch = document.querySelector(".info-info");
const buildSwitch = document.querySelector(".build-info-info");
const infoWindow = document.querySelector(".info");
const buildWindow = document.querySelector(".build-info");
const servicesParent = document.querySelector('.services');
const serviceStatus = document.querySelectorAll(".service-info");

const switchesPatent = document.querySelector('#switches__container');
const overlays = document.querySelectorAll('.overlay--hidden');
const overlaysObj = [];

const PerformOverlaysObj = () => {
    overlaysObj.splice(0, overlaysObj.length);
    for(overlay of overlays)
    {
        overlaysObj.push({id: overlay.id, node: overlay});
    }
};

buildSwitch.addEventListener('click',() => {
    infoWindow.classList.add("info--inactive");
    buildWindow.classList.add("build-info--active");
});
infoSwitch.addEventListener('click',()=>{
    infoWindow.classList.remove("info--inactive");
    buildWindow.classList.remove("build-info--active");
});

servicesParent.addEventListener('mouseover', event => {
    if(event.target.classList.contains('services-element') || event.target.classList.contains('services__elemnet__img'))
    {
        const id = event.target.id || event.target.parentElement.id;
        serviceStatus[id].classList.add('service-info--active');
    }
});
servicesParent.addEventListener('mouseout', event => {
    if(event.target.classList.contains('services-element') || event.target.classList.contains('services__elemnet__img'))
    {
        const id = event.target.id || event.target.parentElement.id;
        serviceStatus[id].classList.remove('service-info--active');
    }
});

ipcRenderer.on('render-report', (event, arg) => {
    RenderInfo(arg.report);
    RenderBuildingInfo(arg.building);
    InsertImages(arg.building.data.mapDir);
    PerformOverlaysObj();
    UpdateStatuses(arg.report);

    if(!arg.report.isActive)
        finishButton.classList.add('button--hidden');
    else
        finishButton.classList.remove('button--hidden');
    //TODO: else check status
});

ipcRenderer.on('update-info', (event, arg) => {
    console.log("UPdate");
    UpdateStatuses(arg);
});

if(switchesPatent != null)
{
    switchesPatent.addEventListener('click', e => {
        if(e.target.classList.contains('switches__checkbox'))
        {
            const checkbox = e.target;

            for(ov of overlaysObj)
            {
                if(ov.id === checkbox.getAttribute('aria-controls'))
                {
                    ov.node.classList.toggle('overlay--hidden');
                }
            }
        }
    });
}