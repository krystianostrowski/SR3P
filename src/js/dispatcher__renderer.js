const { ipcRenderer } = require('electron');

const searchBar = document.querySelector('#location');
const form = document.querySelector('form');
const locationsList = document.querySelector('ul');
const locations = locationsList.querySelectorAll('li');
const shadow = document.querySelector('.case');
const adressesWrapper = document.querySelector('#adresses');
const plusBtn = document.querySelector('.plus');
const sendFormBtn = document.querySelector('.send');

const locationHiddenClass = 'location--hidden';
const locationVisibleClass = 'location--visible';

let bIsSearchbarActive = false;

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
}

const SearchReport = report => {
    ipcRenderer.send('search-report', report);
};

const OnLocationClicked = e => {
    if(e.target.classList.contains('locations__item'))
    {
        searchBar.value = e.target.textContent;

        SearchReport(e.target.textContent.toLowerCase());
    }
};

const OnSearchBarInput = e => {
    const input = e.target.value.toLowerCase();

    locations.forEach(location => {
        const locationText = location.textContent.toLowerCase();

        if(!locationText.includes(input))
        {
            if(location.classList.contains(locationVisibleClass))
            {
                location.classList.remove(locationVisibleClass);
            }

            location.classList.add(locationHiddenClass);
        }
        else if(locationText.includes(input))
        {
            if(location.classList.contains(locationHiddenClass))
            {
                location.classList.remove(locationHiddenClass);
            }

            location.classList.add(locationVisibleClass);
        }
    });
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

    desc.innerText = "TBA";
    time.innerText = "TBA";
    victims.innerText = "TBA";
    addDang.innerText = "TBA";
    addInf.innerText = report;

    const services = report.services;

    console.log(ambulanceStatus);

    ffStatus.innerText = (services.fireFighters.requested) ? services.fireFighters.state : "not requested"; 
    policeStatus.innerText = (services.police.requested) ? services.police.state : "not requested"; 
    ambulanceStatus.innerText = (services.ambulance.requested) ? services.ambulance.state : "not requested"; 
}

const GetDataFromForm = () => {
    const cityInput = document.querySelector('#city__input');
    const streetInput = document.querySelector('#street__input');
    const buildingInput = document.querySelector('#building__input');

    const policeCheckbox = document.querySelector('#police__checkbox');
    const ambulanceCheckbox = document.querySelector('#ambulance__checkbox');
    const fireFightersCheckbox = document.querySelector('#fire-fighters__checkbox');
    
    let ambulance;
    let police;
    let fireFighters;

    if(ambulanceCheckbox.checked)
    {
        ambulance = {
            requested: true,
            quantity: 1
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
            quantity: 1
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
            quantity: 1
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

    ipcRenderer.send('add-report-to-db', {data, services});
};

ipcRenderer.on('send-report-data', (event, arg) => {
    RenderInfo(arg);
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