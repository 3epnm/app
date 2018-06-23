var _ = require('underscore');
var moment = require('moment');
var server = require('http').createServer();
var redis = require("redis");

var io = require('socket.io')(server);

var subscribeTimedGpio = function (client) {
    var redis_client = redis.createClient();

    redis_client.on('message', function (channel, message) {
        message = JSON.parse(message);
        client.emit('timedgpio', message);
    });

    redis_client.subscribe('timedgpio:state');

    client.on('timedgpio', function (message) {
        var redis_publish = redis.createClient();
        console.log(message);
        redis_publish.publish('timedgpio:set', JSON.stringify(message));
    });

    client.on('disconnect', function() {
        redis_client.unsubscribe();
        redis_client.quit();
    });
}

io.of('/timedgpio').on('connection', function(client) {
    subscribeTimedGpio(client);
});

var subscribeGpio = function (client) {
    var redis_client = redis.createClient();

    redis_client.on('message', function (channel, message) {
        message = JSON.parse(message);
        client.emit('gpio', message);
    });

    redis_client.subscribe('gpio:state');

    client.on('gpio', function (message) {
        var redis_publish = redis.createClient();
        // console.log(message);
        redis_publish.publish('gpio:set', JSON.stringify(message));
    });

    client.on('disconnect', function() {
        redis_client.unsubscribe();
        redis_client.quit();
    });
}

io.of('/gpio').on('connection', function(client) {
    subscribeGpio(client);
});

var subscribeTemperature = function (client) {
    var map_data = {
        "temp0": "28FF8C56911501BD",
        "temp1": "28FFE356911501C3"
    };

    var redis_client = redis.createClient();

    redis_client.on('message', function (channel, message) {
        message = JSON.parse(message);

        var time = Math.floor(Date.now() / 1000);
        var item = {
            time: time
        };

        _.each(map_data, function (val, key) {
            item[val] = message[key];
        });

        client.emit('temperature', item);
    });

    redis_client.subscribe('temperature');

    client.on('disconnect', function() {
        redis_client.unsubscribe();
        redis_client.quit();
    });
}

io.of('/temperature').on('connection', function(client) {
    subscribeTemperature(client);
});

var subscribeDistance = function (client) {
    var redis_client = redis.createClient();

    redis_client.on('message', function (channel, message) {
        message = JSON.parse(message);

        var time = Math.floor(Date.now() / 1000);
        var item = {
            time: time,
            distance: Number(message)
        };

        client.emit('distance', item);
    });

    redis_client.subscribe('distance');

    client.on('disconnect', function() {
        redis_client.unsubscribe();
        redis_client.quit();
    });
}

io.of('/distance').on('connection', function(client) {
    subscribeDistance(client);
});

var subscribePh = function (client) {
    var redis_client = redis.createClient();

    redis_client.on('message', function (channel, message) {
        message = JSON.parse(message);

        var time = Math.floor(Date.now() / 1000);
        var item = {
            time: time,
            ph: Number(message)
        };

        client.emit('ph', item);
    });

    redis_client.subscribe('ph');

    client.on('disconnect', function() {
        redis_client.unsubscribe();
        redis_client.quit();
    });
}

io.of('/ph').on('connection', function(client) {
    subscribePh(client);
});

var subscribeConductivity = function (client) {
    var map_data = {
        "ec": "ec",
        "tds": "tds",
        "sal": "sal"
    };

    var redis_client = redis.createClient();

    redis_client.on('message', function (channel, message) {
        message = JSON.parse(message);

        var time = Math.floor(Date.now() / 1000);
        var item = {
            time: time
        };

        _.each(map_data, function (val, key) {
            item[val] = Number(message[key]);
        });

        client.emit('conductivity', item);
    });

    redis_client.subscribe('conductivity');

    client.on('disconnect', function() {
        redis_client.unsubscribe();
        redis_client.quit();
    });
}

io.of('/conductivity').on('connection', function(client) {
    subscribeConductivity(client);
});

server.listen(3000);
