const infoSwitch = document.querySelector(".info-info");
const buildSwitch = document.querySelector(".build-info-info");
const infoWindow = document.querySelector(".info");
const buildWindow = document.querySelector(".build-info");
const servicesParent = document.querySelector('.services');
const serviceStatus = document.querySelectorAll(".service-info");

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