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

let selectedCity = null;
let selectedStreet = null;
let selectedBuilding = null;

const sendFormBtn = document.querySelector('.send');

const policeCheckbox = document.querySelector('#police__checkbox');
const ambulanceCheckbox = document.querySelector('#ambulance__checkbox');
const fireFightersCheckbox = document.querySelector('#fire-fighters__checkbox');
const ffQuantityInput = document.querySelector('#ff-quantity');
const policeQuantityInput = document.querySelector('#police-quantity');
const ambulanceQuantityInput = document.querySelector('#ambulance-quantity');

const ShowList = listNode => {
    listNode.parentElement.classList.remove('list--hidden');  
};

const HideList = listNode => {
    listNode.parentElement.classList.add('list--hidden');
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

ipcRenderer.on('load', () => {
    let index = 0; // 0 - city, 1 - street, 2 - building

    for(list of lists)
    {
        //ClearList(list);
        //FillFormRandomLocations(5, null, list);
        index++;
        
    }

    streetInput.disabled = true;
    buildingInput.disabled = true;
});

const x = [
    {
        "city": "Słupsk",
        "streets": [
            {
                "name": "X",
                "buildings": [
                    1,2,3,4,5,6,7,8,9,10,2222222
                ]
            }
        ]
    },
    {
        "city": "Słupsk",
        "streets": [
            {
                "name": "X",
                "buildings": [
                    1,2,3,4,5,6,7,8,9,10,2222222
                ]
            }
        ]
    }
]

cityInput.addEventListener('click', () => {
    ShowList(cityInputList);
});

cityInput.addEventListener('input', () => {

});