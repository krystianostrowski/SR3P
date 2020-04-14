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

const AddLocationToList = (list, string) => {
    const li = document.createElement('li');
    li.classList.add('location--visible')

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
const FillFormRandomLocations = (locations, placesArray, locationsList) => {
    const pickedLocations = [];

    if(locations >= placesArray.length)
    {
        placesArray.forEach(place => {
            AddLocationToList(locationsList, place);
        });
    }
    else
    {
        for(let i = 0; i < locations; i++)
        {
            let randomLocaion = PickRandomLocation(placesArray);

            while(pickedLocations.includes(randomLocaion))
                randomLocaion = PickRandomLocation(placesArray);

            AddLocationToList(locationsList, randomLocaion);
            pickedLocations.push(randomLocaion);
        }
    }
};

module.exports = {
    FillFormRandomLocations: (locations, placesArray, locationsList) => {
        FillFormRandomLocations(locations, placesArray, locationsList);
    },
    ClearList: list => {
        ClearList(list);
    },
    PerformArrayOfStrings: citiesArray => {
        return PerformArrayOfStrings(citiesArray);
    },
    AddLocationToList: (locationsList, string) => {
        AddLocationToList(locationsList, string);
    },
    PerformArrayOfreportsStrings: reportsArray => {
        return PerformArrayOfreportsStrings(reportsArray);
    }
};