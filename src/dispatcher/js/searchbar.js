const PerformArrayOfStrings = citiesArray => {
    const array = [];

    for(city of citiesArray)
    {
        for(street of city.streets)
        {
            for(building of street.buildings)
            {
                array.push(`${street.name} ${building}, ${city.name}`)
            }
        }
    }

    return array;
};

const PerformArrayOfreportsStrings = reportsArray => {
    const array = [];

    for(report of reportsArray)
    {
        array.push(`${report.street} ${report.building}, ${report.city}`);
    }

    return array;
};

/**
 * 
 * @param {Object} list - list to clear node 
 */
const ClearList = list => {
    while(list.firstChild)
        list.removeChild(list.firstChild);
};

const AddLocationToList = (list, string, bForm = false) => {
    const li = document.createElement('li');
    li.classList.add('location--visible')

    if(!bForm)
    {
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left-li');

        const img = document.createElement('img');
        img.src = '../resources/img/lokacja.png';

        leftDiv.appendChild(img);

        const rightDiv = document.createElement('div');
        rightDiv.classList.add('right-li');
        rightDiv.classList.add('locations__item');
        rightDiv.innerText = string;

        li.appendChild(leftDiv);
        li.appendChild(rightDiv);
    }
    else
    {
        li.classList.add('list__item');

        const span = document.createElement('span');
        span.style.margin = 'auto';

        span.innerText = string;

        li.appendChild(span);
    }

    list.appendChild(li);
};

const PickRandomLocation = locationsArray => {
    const random = Math.floor(Math.random() * locationsArray.length);
    return locationsArray[random];
};

/**
 * 
 * @param {Int} locations - number of locations to display on list
 * @param {String[]} placesArray - array of locations strings 
 * @param {Object} locationsList - list node
 */
const FillFormRandomLocations = (locations, placesArray, locationsList, bForm = false) => {
    const pickedLocations = [];

    if(locations >= placesArray.length)
    {
        placesArray.forEach(place => {
            AddLocationToList(locationsList, place, bForm);
        });
    }
    else
    {
        for(let i = 0; i < locations; i++)
        {
            let randomLocaion = PickRandomLocation(placesArray);

            while(pickedLocations.includes(randomLocaion))
                randomLocaion = PickRandomLocation(placesArray);

            AddLocationToList(locationsList, randomLocaion, bForm);
            pickedLocations.push(randomLocaion);
        }
    }
};

module.exports = {
    FillFormRandomLocations: FillFormRandomLocations,
    ClearList: list => {
        ClearList(list);
    },
    PerformArrayOfStrings: citiesArray => {
        return PerformArrayOfStrings(citiesArray);
    },
    AddLocationToList: AddLocationToList,
    PerformArrayOfreportsStrings: reportsArray => {
        return PerformArrayOfreportsStrings(reportsArray);
    }
};