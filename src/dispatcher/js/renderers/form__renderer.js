const { DebugLog, LogTypes} = require('../js/debug');

const cityInputParent = document.querySelector('#city');
const cityInput = cityInputParent.querySelector('input');
const cityInputList = cityInputParent.querySelector('ul');

const streetInputParent = document.querySelector('#street');
const streetInput = streetInputParent.querySelector('input');
const streetInputList = streetInputParent.querySelector('ul');

const buildingInputParent = document.querySelector('#building');
const buildingInput = buildingInputParent.querySelector('input');
const buildingInputList = buildingInputParent.querySelector('ul');

const lists = [cityInputList, streetInputList, buildingInputList];

let citiesObject;
let citiesStrings = [];
let streetStrings = [];
let buildingsNumbers = [];

let selectedCity = null;
let selectedStreet = null;
let selectedBuilding = null;

let openedList = null;
let openedListId = null;

const locationsToDisplay = 5;

const sendFormBtn = document.querySelector('.send');

const policeCheckbox = document.querySelector('#police__checkbox');
const ambulanceCheckbox = document.querySelector('#ambulance__checkbox');
const fireFightersCheckbox = document.querySelector('#fire-fighters__checkbox');
const ffQuantityInput = document.querySelector('#ff-quantity');
const policeQuantityInput = document.querySelector('#police-quantity');
const ambulanceQuantityInput = document.querySelector('#ambulance-quantity');

const HideList = (event, listNode) => {
    if(event == null && listNode != null)
    {
        listNode.parentElement.classList.add('list--hidden');
        openedList = null;
        openedListId = null;

        return;
    }

    if(listNode != null && !event.target.classList.contains('list__item') && event.target.id != openedListId)
    {
        listNode.parentElement.classList.add('list--hidden');
        openedList = null;
        openedListId = null;
    }
};

const ShowList = (listNode, id) => {
    HideList(null, openedList);

    openedList = listNode;
    openedListId = id;
    listNode.parentElement.classList.remove('list--hidden');
};

const PerformCitiesArray = obj => {
    const array = [];

    for(city of obj)
    {
        array.push(city.name);
    }

    return array;
};

const PerformStreets = cityName => {
    const array = [];
    let streets = [];

    for(city of citiesObject)
    {
        if(city.name == cityName)
            streets = city.streets;  
    }

    for(street of streets)
    {
        array.push(street.name);
    }

    return array;
};

const PerformBuildings = (cityName, streetName) => {
    let array = [];
    let streets = []; 

    for(city of citiesObject)
    {
        if(city.name == cityName)
            streets = city.streets;  
    }

    for(street of streets)
    {
        if(street.name == streetName)
            array = street.buildings;
    }

    return array;
};

const GetDataFromForm = () => {
    DebugLog("Button clicked", LogTypes.ERROR);
    // const cityInput = document.querySelector('#city__input');
    // const streetInput = document.querySelector('#street__input');
    // const buildingInput = document.querySelector('#building__input');
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

const OnListItemClicked = (e, input) => {
    if(e.target.classList.contains('list__item'))
    {
        let inputNode;
        let nextInputNode;
        const text = e.target.textContent;

        console.log(input);

        switch(input)
        {
            case 'city':
                selectedCity = text;
                inputNode = cityInput;
                nextInputNode = streetInput;
                streetStrings = PerformStreets(text);
                ClearList(streetInputList);
                FillFormRandomLocations(locationsToDisplay, streetStrings, streetInputList, true);
                break;
            
            case 'street':
                selectedStreet = text;
                inputNode = streetInput;
                nextInputNode = buildingInput;
                buildingsNumbers = PerformBuildings(selectedCity, selectedStreet);
                ClearList(buildingInputList);
                FillFormRandomLocations(locationsToDisplay, buildingsNumbers, buildingInputList, true);
                break;

            case 'building':
                selectedBuilding = text;
                inputNode = buildingInput;
                nextInputNode = null;
                break;
        }

        inputNode.value = text;

        if(nextInputNode != null)
            nextInputNode.disabled = false;
    }
};

const OnInput = (e, list, array) => {
    if(citiesStrings == null)
        return;

    const input = e.target.value.toLowerCase();

    ClearList(list);
    array.forEach(string => {
        if(string == '')
            return;

        if(string.toLocaleLowerCase().includes(input))
        {
            AddLocationToList(list, string, true);
        }
    });
};

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

if(sendFormBtn != null)
{
    sendFormBtn.addEventListener('click', GetDataFromForm);
}

ipcRenderer.on('load', (event, arg) => {
    citiesObject = arg;

    for(list of lists)
    {
        ClearList(list);
    }

    citiesStrings = PerformCitiesArray(citiesObject);
    FillFormRandomLocations(locationsToDisplay, citiesStrings, cityInputList, true);

    streetInput.disabled = true;
    buildingInput.disabled = true;
});

cityInput.addEventListener('click', () => {
    ShowList(cityInputList, cityInput.id);
});

cityInput.addEventListener('input', e => {
    OnInput(e, cityInputList, citiesStrings);
});

streetInput.addEventListener('click', () => {
    ShowList(streetInputList, streetInput.id);
});

buildingInput.addEventListener('click', () => {
    ShowList(buildingInputList, buildingInput.id);
});

document.addEventListener('click', e => {
    console.log(e.target.classList);
    if(e.target.classList.contains('list__item'))
    {
        const input = e.target.parentElement.getAttribute('input');
        OnListItemClicked(e, input);
    }

    HideList(e, openedList);
});