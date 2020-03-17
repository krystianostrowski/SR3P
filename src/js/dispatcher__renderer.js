const { ipcRenderer } = require('electron');
const { RenderInfo } = require('../js/render__info');

const searchBar = document.querySelector('#location');
const form = document.querySelector('form');
const locationsList = document.querySelector('ul');
const locations = locationsList.querySelectorAll('li');
const shadow = document.querySelector('.case');
const adressesWrapper = document.querySelector('#adresses');
const plusBtn = document.querySelector('.plus');
const sendFormBtn = document.querySelector('.send');
const homeBtn = document.querySelector('.home');

const locationHiddenClass = 'location--hidden';
const locationVisibleClass = 'location--visible';

const policeCheckbox = document.querySelector('#police__checkbox');
const ambulanceCheckbox = document.querySelector('#ambulance__checkbox');
const fireFightersCheckbox = document.querySelector('#fire-fighters__checkbox');
const ffQuantityInput = document.querySelector('#ff-quantity');
const policeQuantityInput = document.querySelector('#police-quantity');
const ambulanceQuantityInput = document.querySelector('#ambulance-quantity');

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
        time: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`,
        desc: desc.value,
        victims: (victims == '' || victims == null) ? null : parseInt(victims.value),
        dangers: dangers.value,
        info: info.value
    }

    ipcRenderer.send('add-report-to-db', {data, services, additionalInfo});
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

if(homeBtn != null)
{
    homeBtn.addEventListener('click', () => {
        ipcRenderer.send('home-button-clicked', 'dispatcher');
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