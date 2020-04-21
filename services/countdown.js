let _countdownMinutes = 30;

const getCountdownMinutes = () => {
    return _countdownMinutes;
};

const setCountdownMinutes = (minutes) => {
    _countdownMinutes = minutes;
    return _countdownMinutes;
};

module.exports = {
    getCountdownMinutes,
    setCountdownMinutes
};