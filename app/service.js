var _ = require('underscore');
var moment = require('moment');
var rrdtool = require('rrdtool');

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

app.get('/gpio/:pin/:mode', function (req, res, next) {
    var pin = Number(req.params.pin);

    if (req.params.mode == "on") {
    }
    if (req.params.mode == "off") {
    }    
    
    res.send('ok');
});

app.get('/temperature', function (req, res, next) {
    var temperature_db = rrdtool.open('/home/pi/Development/data/temperature.rrd');

    var map_data = {
        "temp0": "28FF8C56911501BD",
        "temp1": "28FFE356911501C3"
    };

    var start = rrdtool.now() - 3600;
    var end = rrdtool.now();

    temperature_db.fetch('AVERAGE', start, end, function (err, data) {
        if (err) { return next(err); }
        
        var result = [];        
        _.each(data, function (dataset) {
            var hasNull = false, item = { time: dataset.time };

            _.each(map_data, function (val, key) {
                item[val] = dataset.values[key];
                hasNull = _.isNull(item[val]);

            });

            if (!hasNull) {
                result.push(item);
            }
        });

        res.json(result.reverse());
    });
});

app.get('/distance', function (req, res, next) {
    var distance_db = rrdtool.open('/home/pi/Development/data/distance.rrd');

    var start = rrdtool.now() - 300;
    var end = rrdtool.now();

    distance_db.fetch('AVERAGE', start, end, function (err, data) {
        if (err) { return next(err); }
        
        var result = [];        
        _.each(data, function (dataset) {
            var item = { time: dataset.time, distance: dataset.values.dist };
    
            result.push(item);
        });

        res.json(_.filter(result.reverse(), item => !_.isNull(item.distance)));
    });
});

app.listen(3030);