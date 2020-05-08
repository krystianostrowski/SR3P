const infoSwitch = document.querySelector(".info-info");
const buildSwitch = document.querySelector(".build-info-info");
const infoWindow = document.querySelector(".info");
const buildWindow = document.querySelector(".build-info");

buildSwitch.addEventListener('click',() => {
    infoWindow.classList.add("info--inactive");
    buildWindow.classList.add("build-info--active");
})
infoSwitch.addEventListener('click',()=>{
    infoWindow.classList.remove("info--inactive");
    buildWindow.classList.remove("build-info--active");
})