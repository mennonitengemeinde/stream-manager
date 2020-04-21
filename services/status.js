let _currentStatus = 'offline';

const getCurrentStatus = () => {
    return _currentStatus;
};

const setCurrentStatus = (status) => {
    _currentStatus = status;
    return _currentStatus;
};

module.exports = {
    getCurrentStatus,
    setCurrentStatus
};