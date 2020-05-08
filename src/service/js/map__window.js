const mapSwitch = document.querySelector(".map");
const infoSwitch = document.querySelector(".notificaton-info");
const infoWindow = document.querySelector(".notificaton-info-window");
const mapWindow = document.querySelector(".map-window");

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

