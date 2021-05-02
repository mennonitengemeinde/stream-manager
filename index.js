const express = require('express');
const morgan = require('morgan');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { getCurrentStatus, setCurrentStatus } = require('./services/status');
const { getCountdownSeconds, setCountdownSeconds } = require('./services/countdown');
const { STATUS } = require('./services/const');

let timer;
let timerStarted = false;
let timerOrder = 'desc';

app.use(morgan('tiny'));
app.use(express.static(__dirname + '/node_modules'));
app.use('/static', express.static(__dirname + '/static'));

// GET '/'
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/templates/index.html');
});

// GET '/admin'
app.get('/admin', (req, res, next) => {
    res.sendFile(__dirname + '/templates/admin.html');
});

// --------------------------- API ---------------------------

// GET '/api/v1/obs/offline
app.get('/api/v1/obs/offline', (req, res, next) => {
    const data = {
        status: setCurrentStatus(STATUS.OFFLINE)
    };

    stopTimer();

    io.sockets.emit('scene', data)
    res.json(data);
});

// GET '/api/v1/obs/piano
app.get('/api/v1/obs/piano', (req, res, next) => {
    const data = {
        status: setCurrentStatus(STATUS.PIANO)
    };

    stopTimer();

    io.sockets.emit('scene', data)
    res.json(data);
});

// GET '/api/v1/obs/preacher
app.get('/api/v1/obs/preacher/:minutes', (req, res, next) => {
    stopTimer();
    const data = {
        status: setCurrentStatus(STATUS.PREACHER),
        minutes: req.params.minutes
    };

    setCountdownSeconds(Number(req.params.minutes) * 60);
    startTimer();

    io.sockets.emit('scene', data)
    res.json(data);
});

// --------------------------- SocketIO ---------------------------

// Connection
io.on('connection', function (client) {
    console.log('Client connected...');
    const data = {};

    data.status = getCurrentStatus();

    if (data.status === STATUS.PREACHER) {
        data.minutes = getCountdownSeconds();
    }

    client.emit('current-status', data);
});

// --------------------------- Timer ---------------------------

const startTimer = () => {
    timer = setInterval(function () {
        timerStarted = true;
        const seconds = getCountdownSeconds();
        if (seconds === 0) {
            timerOrder = 'asc';
        }

        if (timerOrder === 'desc') {
            setCountdownSeconds(seconds - 1);
        } else if (timerOrder === 'asc') {
            setCountdownSeconds(seconds + 1);
        }

        const secondsString = seconds % 60;
        const zeroSeconds = secondsString < 10 ? '0' : '';

        const data = {
            minutes: Math.floor(seconds / 60),
            seconds: `${zeroSeconds}${secondsString}`,
            timerOrder: timerOrder
        }
        
        io.sockets.emit('timer', data);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timer);
    timerOrder = 'desc';
    timerStarted = false;
};


server.listen(3000, () => {
    console.log(`Running on port 3000`);
});
