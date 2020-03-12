const { ipcRenderer } = require('electron');

const searchBar = document.querySelector('#location');
const form = document.querySelector('form');
const locationsList = document.querySelector('ul');
const locations = locationsList.querySelectorAll('li');
const shadow = document.querySelector('.case');
const adressesWrapper = document.querySelector('#adresses');

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

    desc.innerText = "TBA";
    time.innerText = "TBA";
    victims.innerText = "TBA";
    addDang.innerText = "TBA";
    addInf.innerText = report.data.city;
}

ipcRenderer.on('send-report-data', (event, arg) => {
    console.log("object");
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