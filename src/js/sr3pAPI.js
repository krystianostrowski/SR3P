const fs = require('fs');
const { DebugLog, LogTypes } = require('./debug');

const dbPath = './db/database.json';
let bDbExists = false;

const GetData = () => {
    let data;

    if(fs.existsSync(dbPath))
    {
        bDbExists = true;
        DebugLog('Connected to database');
        data = fs.readFileSync(dbPath, (err, json) => {
            if(err)
                return DebugLog(err.message, LogTypes.ERROR);

            return json;
        });
    }
    else
    {
        bDbExists = false;
        return DebugLog('Databse not found', LogTypes.ERROR);
    }

    data = JSON.parse(data);

    return data;
}

const SaveData = data => {
    //TODO: Save database file
};

/**
 * @description Function gets city object from database
 * @param {String} name City name
 * @returns City object
 */
const GetCity = name => {
    const data = GetData();

    if(!bDbExists)
        return;

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

        DebugLog(`Couldn't find building number: ${number}!`, LogTypes.WARN);
    }
}

/**
 * 
 * @param {int} id 
 */
function GetReport(id) {
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
 * 
 * @param {String} city 
 * @param {String} streetName 
 */
function GetReport(city, streetName) {
    if(!bDbExists || city == null || streetName == null)
        return;

    const data = GetData();
    const reports = data.reports;

    for(report of reports)
    {
        const reportData = report.data;
        if(reportData == city && reportData.street == streetName)
        {
            DebugLog(`Report: ${reportData.city} ${reportData.street}`);
            return report;
        }

        DebugLog(`Couldn't find report: ${reportData.city} ${reportData.street}`, LogTypes.WARN);
    }
}

/**
 * 
 * @param {Object} data 
 * @param {Object} services 
 */
const AddReport = (data, services) => {
    let db = GetData();
    
    data = {
        "city": "",
        "street": "",
        "building": 0
    }

    services = {
        "ambulance": {
            "requested": false,
        },
        "police": {
            "requested": false,
        },
        "fireFighters": {
            "requested": true,
            "quantity": 1,
        }
    }

    if(services.ambulance.requested)
    {

    }
    else
    {

    }

    if(services.police.requested)
    {

    }

    if(services.fireFighters.requested)
    {

    }

    db.reports.push({id: 0, services: {}, data: data});

    SaveData(db);
}

module.exports = {
    GetCity: name => {
        return GetCity(name);
    },
    GetStreet: (city, name) => {
        return GetStreet(city, name);
    },
    GetBuilding: (street, number) => {
        return GetBuilding(street, number);
    }
}