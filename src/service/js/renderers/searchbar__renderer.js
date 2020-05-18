const searchBar = document.querySelector('.search__input');
const citiesList = document.querySelector('#reports-list');
const adressesWrapper = document.querySelector('#adresses');
const numberOfReportsOnList = 5;
let citiesArray = [];
let citiesStrings = [];

let bIsSearchbarActive = false;

const OnSearchBarInput = e => {
    if(citiesArray == null)
        return;

    const text = e.target.value.toLowerCase();

    if(citiesList != null)
        ClearList(citiesList);

    citiesStrings.forEach(string => {
        if(string == '')
            return;

        if(string.toLowerCase().includes(text))
        {
            AddLocationToList(citiesList, string);
        }
    });
};

const ActivateSearchBar = () => {
    if(!bIsSearchbarActive)
    {
        adressesWrapper.classList.add('locations--active');

        bIsSearchbarActive = true;
    }
};

const DeActivateSearchBar = e => {
    if(bIsSearchbarActive && e.target.id != "location")
    {
        adressesWrapper.classList.remove('locations--active');

        bIsSearchbarActive = false;
    }
};

const SearchReport = string => {
    ipcRenderer.send('search-report-service', string);
};

const OnReportClick = e => {
    if(e.target.classList.contains('locations__item'))
    {
        searchBar.value = e.target.textContent;

        SearchReport(e.target.textContent.toLowerCase());
    }
};

if(searchBar != null)
{
    searchBar.addEventListener('input', OnSearchBarInput);
    searchBar.addEventListener('click', ActivateSearchBar);
    document.addEventListener('click', DeActivateSearchBar);
}

if(citiesList != null)
{
    citiesList.addEventListener('click', OnReportClick);
}

ipcRenderer.on('got-places', (event, arg) => {
    citiesArray = arg;
    citiesStrings = PerformArrayOfStrings(citiesArray);
    console.log(arg, citiesStrings);

    if(citiesList == null)
        return;

    ClearList(citiesList);
    FillFormRandomLocations(numberOfReportsOnList, citiesStrings, citiesList);
});