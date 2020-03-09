const { remote, ipcRenderer } = require('electron');

document.querySelector("#min-btn").addEventListener('click', () => {
    remote.getCurrentWindow().minimize();
});

document.querySelector("#max-btn").addEventListener('click', () => {
    const currentWindow = remote.getCurrentWindow();
    if (currentWindow.isMaximized()) {
        currentWindow.unmaximize();
    } else {
        currentWindow.maximize();
    }
});

document.querySelector("#close-btn").addEventListener('click', () => {
    remote.app.quit();
});

const searchBar = document.querySelector('#location');
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
        locations.forEach(location => location.classList.add(locationVisibleClass));

        bIsSearchbarActive = true;
    }
};

const DeActivateSearchBar = e => {
    if(bIsSearchbarActive && e.target.id != "location")
    {
        shadow.classList.remove('shadow--active');
        adressesWrapper.classList.remove('locations--active');
        locations.forEach(location => location.classList.remove(locationVisibleClass));

        bIsSearchbarActive = false;
    }
}

const OnLocationClicked = e => {
    if(e.target.classList.contains('locations__item'))
    {
        searchBar.value = e.target.textContent;
        DeActivateSearchBar();

        //TODO: Search for reports in database
    }
};

const OnSearchBarInput = e => {
    const input = e.target.value.toLowerCase();

    locations.forEach(location => {
        const locationText = location.textContent.toLocaleLowerCase();

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

searchBar.addEventListener('click', ActivateSearchBar);
document.querySelector('html').addEventListener('click', DeActivateSearchBar);
searchBar.addEventListener('input', OnSearchBarInput);

locationsList.addEventListener('click', OnLocationClicked);

//TODO: Move locations.js to dispatcher__renderer.js