const locationsToDiplayOnList = 5;

const searchBar = document.querySelector('#location');
const locationsList = document.querySelector('ul');
const shadow = document.querySelector('.case');
const adressesWrapper = document.querySelector('#adresses');
const form = document.querySelector('form');

let bIsSearchbarActive = false;
let citiesArray;
let placesArray;

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

ipcRenderer.on('got-cities', (event, arg) => {
    citiesArray = arg;
    placesArray = PerformArrayOfStrings(citiesArray);
    ClearList(locationsList);
    FillFormRandomLocations(locationsToDiplayOnList, placesArray, locationsList);
});

searchBar.addEventListener('click', ActivateSearchBar);
searchBar.addEventListener('input', OnSearchBarInput);

locationsList.addEventListener('click', OnLocationClicked);

document.addEventListener('click', DeActivateSearchBar);

form.addEventListener('submit', () => { 
    event.preventDefault();

    SearchReport(searchBar.value.toLocaleLowerCase());
});