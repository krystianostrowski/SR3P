const { ipcRenderer } = require('electron');
const { RenderInfo, RenderBuildingInfo, InsertImages } = require('../js/render__info');
const { ClearList, PerformArrayOfStrings, FillFormRandomLocations, AddLocationToList } = require('../js/searchbar');

const searchBar = document.querySelector('#location');
const form = document.querySelector('form');
const locationsList = document.querySelector('ul');
const locations = locationsList.querySelectorAll('li');
const shadow = document.querySelector('.case');
const adressesWrapper = document.querySelector('#adresses');
const plusBtn = document.querySelector('.plus');
const sendFormBtn = document.querySelector('.send');
const homeBtn = document.querySelector('.home');
const seeReportBtn = document.querySelector('#see-report');

const locationsToDiplayOnList = 5;

const policeCheckbox = document.querySelector('#police__checkbox');
const ambulanceCheckbox = document.querySelector('#ambulance__checkbox');
const fireFightersCheckbox = document.querySelector('#fire-fighters__checkbox');
const ffQuantityInput = document.querySelector('#ff-quantity');
const policeQuantityInput = document.querySelector('#police-quantity');
const ambulanceQuantityInput = document.querySelector('#ambulance-quantity');

const switchesPatent = document.querySelector('#switches__container');
const overlays = document.querySelectorAll('.overlay--hidden');
const overlaysObj = [];

let bIsSearchbarActive = false;
let citiesArray;
let placesArray;
let report = null;
let dir = "";

const PerformOverlaysObj = () => {
    for(overlay of overlays)
    {
        overlaysObj.push({id: overlay.id, node: overlay});
    }
};

const ActivateSearchBar = () => {
    if(!bIsSearchbarActive)
    {
        shadow.classList.add('shadow--active');
        adressesWrapper.classList.add('locations--active');

        bIsSearchbarActive = true;
    }
};

const DeActivateSearchBar = e => {
    if(bIsSearchbarActive && e.target.id != "location")
    {
        shadow.classList.remove('shadow--active');
        adressesWrapper.classList.remove('locations--active');

        bIsSearchbarActive = false;
    }
};

const SearchReport = string => {
    ipcRenderer.send('search-building', string);
};

const OnLocationClicked = e => {
    if(e.target.classList.contains('locations__item'))
    {
        searchBar.value = e.target.textContent;

        SearchReport(e.target.textContent.toLowerCase());
    }
};

const OnSearchBarInput = e => {
    if(citiesArray == null)
        return;

    const input = e.target.value.toLowerCase();

    ClearList(locationsList);
    placesArray.forEach(string => {
        if(string == '')
            return;

        if(string.toLocaleLowerCase().includes(input))
        {
            AddLocationToList(locationsList, string);
        }
    });
    
};

const GetDataFromForm = () => {
    const cityInput = document.querySelector('#city__input');
    const streetInput = document.querySelector('#street__input');
    const buildingInput = document.querySelector('#building__input');
    const desc = document.querySelector('#desc');
    const victims = document.querySelector('#victims');
    const dangers = document.querySelector('#dangers');
    const info = document.querySelector('#additional-info');
    
    const date = new Date();

    let ambulance;
    let police;
    let fireFighters;

    if(ambulanceCheckbox.checked)
    {
        ambulance = {
            requested: true,
            quantity: (ambulanceQuantityInput.value <= 0 || ambulanceQuantityInput.value == null || ambulanceQuantityInput.value == '' ) ? 1 : parseInt(ambulanceQuantityInput.value)
        }
    }
    else
    {
        ambulance = {
            requested: false
        }
    }

    if(policeCheckbox.checked)
    {
        police = {
            requested: true,
            quantity: (policeQuantityInput.value <= 0 || policeQuantityInput.value == null || policeQuantityInput.value == '' ) ? 1 : parseInt(policeQuantityInput.value)
        }
    }
    else
    {
        police = {
            requested: false
        }
    }

    if(fireFightersCheckbox.checked)
    {
        fireFighters = {
            requested: true,
            quantity: (ffQuantityInput.value <= 0 || ffQuantityInput.value == null || ffQuantityInput.value == '' ) ? 1 : parseInt(ffQuantityInput.value)
        }
    }
    else
    {
        fireFighters = {
            requested: false
        }
    }

    const services = {
        ambulance: ambulance,
        police: police,
        fireFighters: fireFighters
    }

    const data = {
            city: cityInput.value,
            street: streetInput.value,
            building: parseInt(buildingInput.value)
    }

    const additionalInfo = {
        time: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
        desc: desc.value,
        victims: (victims == '' || victims == null) ? null : parseInt(victims.value),
        dangers: dangers.value,
        info: info.value
    }

    ipcRenderer.send('add-report-to-db', {data, services, additionalInfo});
};

ipcRenderer.on('send-report-data', (event, arg) => {
    RenderInfo(arg.report);
    InsertImages(arg.dir);
    PerformOverlaysObj();
});

ipcRenderer.on('got-cities', (event, arg) => {
    citiesArray = arg;
    placesArray = PerformArrayOfStrings(citiesArray);
    ClearList(locationsList);
    FillFormRandomLocations(locationsToDiplayOnList, placesArray, locationsList);
});

ipcRenderer.on('get-building-info', (event, arg) => {
    ipcRenderer.send('search-report', arg.adress);
    RenderBuildingInfo(arg.adress, arg.buildingInfo);
});

ipcRenderer.on('found-report', (event, arg) => {
    report = arg.report;
    dir = arg.dir

    if(seeReportBtn != null)
    {
        if(seeReportBtn.classList.contains('see-report__button--hidden'))
            seeReportBtn.classList.remove('see-report__button--hidden');
    }
});

ipcRenderer.on('report-not-found', () => {
    report = null;
    
    if(seeReportBtn != null)
    {
        if(!seeReportBtn.classList.contains('see-report__button--hidden'))
            seeReportBtn.classList.add('see-report__button--hidden');
    }
});

searchBar.addEventListener('click', ActivateSearchBar);
searchBar.addEventListener('input', OnSearchBarInput);

locationsList.addEventListener('click', OnLocationClicked);

form.addEventListener('submit', () => { 
    event.preventDefault();

    SearchReport(searchBar.value.toLocaleLowerCase());
});

document.addEventListener('click', DeActivateSearchBar);

if(plusBtn != null)
{
    plusBtn.addEventListener('click', () => {
        ipcRenderer.send('open-dispatcher-form');
    });
}

if(sendFormBtn != null)
{
    sendFormBtn.addEventListener('click', GetDataFromForm);
}

if(homeBtn != null)
{
    homeBtn.addEventListener('click', () => {
        ipcRenderer.send('home-button-clicked', 'dispatcher');
    });
}

if(seeReportBtn != null)
{
    seeReportBtn.addEventListener('click', () => {
        ipcRenderer.send('display-dispatcher-info', {report, dir});
    });
}

if(policeCheckbox != null)
{
    policeCheckbox.addEventListener('click', () => {
        if(policeCheckbox.checked)
        {
            policeQuantityInput.disabled = false;
        }
        else
        {
            policeQuantityInput.disabled = true;
        }
    });
}

if(ambulanceCheckbox != null)
{
    ambulanceCheckbox.addEventListener('click', () => {
        if(ambulanceCheckbox.checked)
        {
            ambulanceQuantityInput.disabled = false;
        }
        else
        {
            ambulanceQuantityInput.disabled = true;
        }
    });
}

if(fireFightersCheckbox != null)
{
    fireFightersCheckbox.addEventListener('click', () => {
        if(fireFightersCheckbox.checked)
        {
            ffQuantityInput.disabled = false;
        }
        else
        {
            ffQuantityInput.disabled = true;
        }
    });
}

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
/* XDDDDDDDDDDDD */
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
if(locationBtn != null)
{
    locationCloseBtn.addEventListener('click', () => {
        const locationBtn = document.querySelector("#open-location");
        const location = document.querySelector('.location');
        location.classList.remove('location--visible');
        locationBtn.classList.remove('open__location--active');
        locationBtn.classList.toggle('open__location--inactive');

    });
}
/* :) */