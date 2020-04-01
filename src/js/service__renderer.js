const { ipcRenderer } = require('electron');
const { RenderInfo } = require('../js/render__info');
const { FillFormRandomLocations, ClearList, AddLocationToList, PerformArrayOfreportsStrings } = require('../js/searchbar');

const confirmBtn = document.querySelector('#arrival-confirmation');
const homeBtn = document.querySelector('.home');
const searchBtn = document.querySelector('#service-search-button');

const searchBar = document.querySelector('.search__input');
const reportsList = document.querySelector('#reports-list');
const numberOfReportsOnList = 5;
let reportsArray = [];
let reportsStrings = [];

let bCanReceiveReport = true;
let report;

const adressesWrapper = document.querySelector('#adresses');
let bIsSearchbarActive = false;

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

const OnSearchBarInput = e => {
    if(reportsArray == null)
        return;

    const text = e.target.value.toLowerCase();

    if(reportsList != null)
        ClearList(reportsList);

    reportsStrings.forEach(string => {
        if(string == '')
            return;

        if(string.toLowerCase().includes(text))
        {
            AddLocationToList(reportsList, string);
        }
    });
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

ipcRenderer.on('found-report', (event, arg) => {
    RenderInfo(arg);
});

ipcRenderer.on('got-reports', (event, arg) => {
    reportsArray = arg;
    reportsStrings = PerformArrayOfreportsStrings(reportsArray);

    if(reportsList == null)
        return;

    ClearList(reportsList);
    FillFormRandomLocations(numberOfReportsOnList, reportsStrings, reportsList);
});

ipcRenderer.on('request-sending-report', (event, arg) => {
    if(bCanReceiveReport)
        ipcRenderer.send('request-accepted', arg);
    else
        ipcRenderer.send('request-rejected');     
});

ipcRenderer.on('receive-report', (event, arg) => {
    bCanReceiveReport = false;
    RenderInfo(arg);
});

ipcRenderer.on('sending-data', (event, arg) => {
    report = arg;
});

if(searchBar != null)
{
    searchBar.addEventListener('input', OnSearchBarInput);
}

if(confirmBtn != null)
{
    confirmBtn.addEventListener('click', () => {
        ipcRenderer.send('service-reached-destination', report);
    });
}

if(homeBtn != null)
{
    homeBtn.addEventListener('click', () => {
        ipcRenderer.send('home-button-clicked', 'service');
    });
}

if(searchBtn != null)
{
    searchBtn.addEventListener('click', () => {
        const input = document.querySelector('.search__input');
        searchBtn.classList.toggle('search__button--active');
        searchBtn.classList.toggle('search__button--inactive');
        input.classList.toggle('search__input--visible');
    });
}

if(reportsList != null)
{
    reportsList.addEventListener('click', OnReportClick);
}

searchBar.addEventListener('click', ActivateSearchBar);
document.addEventListener('click', DeActivateSearchBar);