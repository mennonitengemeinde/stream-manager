const express = require('express');
const morgan = require('morgan');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { getCurrentStatus, setCurrentStatus } = require('./services/status');
const { getCountdownMinutes, setCountdownMinutes } = require('./services/countdown');
const { STATUS } = require('./services/const');

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

    io.sockets.emit('scene', data)
    res.json(data);
});

// GET '/api/v1/obs/piano
app.get('/api/v1/obs/piano', (req, res, next) => {
    const data = {
        status: setCurrentStatus(STATUS.PIANO)
    };

    io.sockets.emit('scene', data)
    res.json(data);
});

// GET '/api/v1/obs/preacher
app.get('/api/v1/obs/preacher/:minutes', (req, res, next) => {
    const data = {
        status: setCurrentStatus(STATUS.PREACHER),
        minutes: req.params.minutes
    };

    setCountdownMinutes(Number(req.params.minutes));

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
        data.minutes = getCountdownMinutes();
        console.log(`${data.minutes} Minutes`);
    }

    client.emit('current-status', data);
});

server.listen(3000);
