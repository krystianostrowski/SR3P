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
    ERROR: 'error'
}

const Colors = {
    DEFAULT: '\033[0m',
    GREEN: '\033[0;32m',
    RED: '\x1b[31m',
    YELLOW: '\x1b[33m'
}

const DebugLog = (message, LogType = LogTypes.LOG) => {

    switch(LogType)
    {
        case LogTypes.LOG:
            console.log(`${Colors.GREEN} [${GetTime()}] ${message} ${Colors.DEFAULT}`);
            break;

        case LogTypes.WARN: 
            console.log(`${Colors.YELLOW} [${GetTime()}] ${message} ${Colors.DEFAULT}`);
            break;

        case LogTypes.ERROR: 
            console.log(`${Colors.RED} [${GetTime()}] ${message} ${Colors.DEFAULT}`);
            break;
    }
};

module.exports = {
    DebugLog: (message, LogType) => {
        return DebugLog(message, LogType);
    },
    LogTypes
};