let _countdownSeconds = 0;

const getCountdownSeconds = () => {
    return _countdownSeconds;
};

const setCountdownSeconds = (seconds) => {
    _countdownSeconds = Number(seconds);
    return _countdownSeconds;
};



module.exports = {
    getCountdownSeconds,
    setCountdownSeconds
};