var _ = require('underscore');
var moment = require('moment');
var server = require('http').createServer();
var redis = require("redis");

var io = require('socket.io')(server);

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
            distance: message
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

server.listen(3000);
