var _ = require('underscore');
var moment = require('moment');
var rrdtool = require('rrdtool');
var redis = require("redis");

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

app.get('/gpio', function (req, res, next) {
    var redis_client = redis.createClient();
    redis_client.keys('gpio:state:*', function (err, keys) {
        if (err) { return next(err); }
        
        var cnt = keys.length, result = [];
        _.each(keys, function (key) {
            redis_client.get(key, function(err, state) {
                if (err) { return next(err); }
                
                result.push(JSON.parse(state));
               
                if (--cnt === 0) {
                    res.json(result);
                }            
            });
        });
    });   
});

app.get('/temperature', function (req, res, next) {
    var temperature_db = rrdtool.open('/home/pi/Development/data/temperature2.rrd');

    var map_data = {
        "temp0": "28FF8C56911501BD",
        "temp1": "28FFE356911501C3"
    };

    let duration = req.query.duration || 3600;
    var start = rrdtool.now() - duration;
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

    let duration = req.query.duration || 300;
    var start = rrdtool.now() - duration;
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

app.get('/ph', function (req, res, next) {
    var ph_db = rrdtool.open('/home/pi/Development/data/ph2.rrd');

    let duration = req.query.duration || 300;
    var start = rrdtool.now() - duration;
    var end = rrdtool.now();

    ph_db.fetch('AVERAGE', start, end, function (err, data) {
        if (err) { return next(err); }
        
        var result = [];        
        _.each(data, function (dataset) {
            var item = { time: dataset.time, ph: dataset.values.ph };
    
            result.push(item);
        });

        res.json(_.filter(result.reverse(), item => !_.isNull(item.ph)));
    });
});

app.get('/conductivity', function (req, res, next) {
    var temperature_db = rrdtool.open('/home/pi/Development/data/cond2.rrd');

    var map_data = {
        "ec": "ec",
        "tds": "tds",
        "sal": "sal"
    };

    let duration = req.query.duration || 3600;
    var start = rrdtool.now() - duration;
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

app.listen(3030);