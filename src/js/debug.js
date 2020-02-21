const GetTime = () => {
    const date = new Date();

    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    hour = (hour < 10) ? "0" + hour : hour;
    min = (min < 10) ? "0" + min : min;
    sec = (sec < 10) ? "0" + sec : sec;

    return `${hour}:${min}:${sec}`;
}

const LogTypes = {
    LOG: 'log',
    WARN: 'warn',
    ERROR: 'error',
    EXCEPTION: 'exception'
}

const DebugLog = (message, LogType = LogTypes.LOG) => {

    switch(LogType)
    {
        case LogTypes.LOG:
            console.log(`[${GetTime()}] ${message}`);
            break;

        case LogTypes.WARN: 
            console.warn("Not implemented");
            break;
    }
};

module.exports = {
    DebugLog: (message, LogType) => {
        return DebugLog(message, LogType);
    },
    LogTypes
};