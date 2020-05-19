const activeTable = document.querySelector('#active__table');
const archiveTable = document.querySelector('#archive__table');

const activeArray = [];
const archiveArray = [];

const activeNum = document.querySelector('#active-reports-num');
const closedNum = document.querySelector('#closed-reports-num');

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
    activeArray.splice(0, activeArray.length);
    archiveArray.splice(0, archiveArray.length);
    
    PerformArrays(arg);

    //ClearTable(activeTable);
    RenderTable(activeArray, activeTable);

    //ClearTable(archiveTable);
    RenderTable(archiveArray, archiveTable);

    activeNum.innerText = activeArray.length;
    closedNum.innerText = archiveArray.length;
});

document.addEventListener('click', e => {
    console.log(e.target);
    const node = e.target;
    if(node.id == "table__button")
    {
        const reportId = node.getAttribute('report-id');
        ipcRenderer.send('display-dispatcher-info', reportId);
    }
});

const showActiveBtn = document.querySelector('#see-active-reports');
const showFinishedBtn = document.querySelector('#see-finished-reports');
const ActiveReports = document.querySelector('.active-notifications');
const FinishedReports = document.querySelector(".finished-notifications");
const closeTableBtn = document.querySelector('#close-table');
const closeActiveTableBtn = document.querySelector('#close-active-table');

showActiveBtn.addEventListener('click', () => {
    ActiveReports.classList.remove('active-notifications--inactive');
    ActiveReports.classList.add('active-notifications--active');
});
showFinishedBtn.addEventListener('click', () => {
    FinishedReports.classList.remove('finished-notifications--inactive');
    FinishedReports.classList.add('finished-notifications--active');
});
closeTableBtn.addEventListener('click',() => {
    FinishedReports.classList.add('finished-notifications--inactive');
    FinishedReports.classList.remove('finished-notifications--active');
});
closeActiveTableBtn.addEventListener('click',() => {
    ActiveReports.classList.add('active-notifications--inactive');
    ActiveReports.classList.remove('active-notifications--active');
});