const activeTable = document.querySelector('#active__table');
const archiveTable = document.querySelector('#archive__table');

const activeArray = [];
const archiveArray = [];

const ClearTable = tableBody => {
    while(tableBody.firstChild)
        tableBody.removeChild(tableBody.firstChild);
};

const RenderTable = (array, tableBody) => {
    ClearTable(tableBody);

    for(item of array)
    {
        const tr = document.createElement('tr');
        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const button = document.createElement('button');

        td1.innerText = item.additionalInfo.time;
        td2.innerText = item.num;
        button.innerText = 'Zobacz';
        button.id = "table__button";
        button.setAttribute('report-id', item.id);
        button.setAttribute('status', item.isActive);

        td3.appendChild(button);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        tableBody.appendChild(tr);
    }
};

const PerformArrays = reportsArray => {
    for(report of reportsArray)
    {
        if(report.isActive)
            activeArray.push(report);
        else
            archiveArray.push(report);
    }
};

ipcRenderer.on('render-reports-table', (event, arg) => {
    PerformArrays(arg);

    //ClearTable(activeTable);
    RenderTable(activeArray, activeTable);

    //ClearTable(archiveTable);
    RenderTable(archiveArray, archiveTable);
});

document.addEventListener('click', e => {
    console.log(e.target);
    const node = e.target;
    if(node.id == "table__button")
    {
        const reportId = node.getAttribute('report-id');
        ipcRenderer.send('get-report-data', reportId);
    }
});