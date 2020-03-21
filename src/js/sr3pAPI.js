const fs = require('fs');
const { DebugLog, LogTypes } = require('./debug');

const dbPath = './db/database.json';
let bDbExists = false;

const CheckIfDBExists = () => {
    if(fs.existsSync(dbPath))
    {
        bDbExists = true;
        DebugLog('Connected to database');
    }
    else
    {
        bDbExists = false;
        return DebugLog('Databse not found', LogTypes.ERROR);
    }
};

const GetData = () => {
    let data;

    data = fs.readFileSync(dbPath, (err, json) => {
        if(err)
            return DebugLog(err.message, LogTypes.ERROR);

        return json;
    });

    data = JSON.parse(data);

    return data;
}

const SaveData = data => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), error =>
    {
        if(error)
        {
            DebugLog(error.message, LogTypes.ERROR);
            return false;
        }
    });

    return true;
};

/**
 * @description Function gets city object from database
 * @param {String} name City name
 * @returns City object
 */
const GetCity = name => {
    if(!bDbExists)
        return;

    const data = GetData();
    const cities = data.cities;

    for(city of cities)
    {
        if(city.name === name)
        {
            DebugLog(`City: ${city.name}`);
            return city;
        }
    }

    DebugLog(`Couldn't find city: ${name}!`, LogTypes.WARN);
    return null;
}

/**
 * @description Function gets street object from given city object by name
 * @param {Object} city - City object
 * @param {String} name - Street name
 * @returns Street Object
 */
const GetStreet = (city, name) => {
    if(!bDbExists || city == null)
        return;

    const streets = city.streets;

    for(street of streets)
    {
        if(street.name === name)
        {
            DebugLog(`Street: ${street.name}`);
            return street;
        }
    }

    DebugLog(`Couldn't find street: ${name}!`, LogTypes.WARN);
    return null;
};

/**
 * @description Function gets building object from given street object by number
 * @param {Object} street 
 * @param {Number} number 
 * @returns Building object
 */
const GetBuilding = (street, number) => {
    if(!bDbExists || street == null)
        return;

    const buildings = street.buildings;

    for(building of buildings)
    {
        if(building.number == number)
        {
            DebugLog(`Building: ${building.number}`);
            return building;
        }
    }

    DebugLog(`Couldn't find building number: ${number}!`, LogTypes.WARN);
}

/**
 * 
 * @param {int} id 
 */
function GetReportById(id) {
    if(!bDbExists || !isNaN(id))
        return;

    const data = GetData();
    const reports = data.reports;

    for(report of reports)
    {
        if(report.id == id)
        {
            DebugLog(`Report id: ${report.id}`);
            return report;
        }

        DebugLog(`Couldn't find report id: ${report.id}`, LogTypes.WARN);
    }
}

/**
 * @param {String} 
 */
function GetReport(string) {
    if(!bDbExists || string == null)
        return false;

    const data = GetData();
    const reports = data.reports;
    string = string.replace(',', '');
    const substrings = string.split(' ');

    for(report of reports)
    {   
        const reportData = report.data;

        let bCity = false;
        let bStreet = false;
        let bBuilding = false;

        for(substring of substrings)
        {
            if(reportData.city.toLowerCase() == substring)
            {
                bCity = true;
                continue;
            }

            if(reportData.street.toLowerCase() == substring)
            {
                bStreet = true;
                continue;
            }

            if(reportData.building == substring)
            {
                bBuilding = true;
                continue;
            }

        }

        if(bCity && bStreet && bBuilding)
                return report;
    }

    DebugLog(`Couldn't find report: ${string}`, LogTypes.WARN);
    return false;
}

/**
 * 
 * @param {Object} data 
 * @param {Object} services 
 */
const AddReport = (data, services, additionalInfo) => {
    if(!bDbExists)
        return;

    let db = GetData();

    const id =  (db.reports.length == 0) ? 1 : db.reports[db.reports.length - 1].id + 1;

    if(services.ambulance.requested)
    {
        services.ambulance.state = "w drodze";
    }
    else
    {
        services.ambulance.quantity = 0;
        services.ambulance.state = null;
    }

    if(services.police.requested)
    {
        services.police.state = "w drodze";
    }
    else
    {
        services.police.quantity = 0;
        services.police.state = null;
    }

    if(services.fireFighters.requested)
    {
        services.fireFighters.state = "w drodze";
    }
    else
    {
        services.fireFighters.quantity = 0;
        services.fireFighters.state = null;
    }

    const report = {id: id, services: services, data: data, additionalInfo: additionalInfo}
    db.reports.push(report);

    if(!SaveData(db))
        return false;

    return report;
}

const UpdateStatus = reportId => {
    if(!bDbExists)
        return;

    const data = GetData();
    const reports = data.reports;

    let reportIndex;

    for(report of reports)
    {
        if(report.id == reportId)
            reportIndex = reports.indexOf(report);
    }

    data.reports[reportIndex].services.fireFighters.state = "na miejscu";

    SaveData(data);
}

const GetArrayOfCities = () => {
    if(!bDbExists)
        return;

    const data = GetData();
    const cities = data.cities;
    const array = [];

    for(city of cities)
    {
        const streets = [];

        for(street of city.streets)
        {
            const buildings = [];

            for(building of street.buildings)
            {
                buildings.push(building.number.toString());
            }

            streets.push({ name: street.name, buildings: buildings });
        }

        array.push({name: city.name, streets: streets});
    }

    return array;
}

module.exports = {
    CheckIfDBExists: () => {
       CheckIfDBExists(); 
    },
    GetCity: name => {
        return GetCity(name);
    },
    GetStreet: (city, name) => {
        return GetStreet(city, name);
    },
    GetBuilding: (street, number) => {
        return GetBuilding(street, number);
    },
    GetReportById: id => {
        return GetReportById(id);
    },
    GetReport: (string) => {
        return GetReport(string);
    },
    AddReport: (data, services, additionalInfo) => {
        return AddReport(data, services, additionalInfo);
    },
    UpdateStatus: reportId => {
        UpdateStatus(reportId);
    },
    GetArrayOfCities: () => {
        return GetArrayOfCities();
    }
}