var _ = require('underscore');
var moment = require('moment');
var rrdtool = require('rrdtool');
var redis = require("redis");

const { exec } = require('child_process');

var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

app.get('/relais', function (req, res, next) {
    var db = '/home/pi/Development/data/relais.rrd';
    var out = '/home/pi/Development/data/relais.svg';

    var d = req.query.d || '-12h';
    var w = req.query.w || 800;
    var h = req.query.h || 300;
    var u = req.query.u || 16; 
    var l = req.query.l || -1;  

    var def = [ ];
    for (var i = 1; i<9; i++) {
        def.push('DEF:sw' + i + '=' + db + ':sw' + i + ':AVERAGE LINE:sw' + i + '#0000FF');
    }

    var cmd = '/usr/bin/rrdtool graph ' + out + ' --start ' + d + ' --end now ' + def.join(' ') + ' -w ' + w + ' -h ' + h + ' -u ' + u + ' -l ' + l + ' -r -a SVG';

    exec(cmd, (err, stdout, stderr) => {
        if (err) 
            res.status(500).send(err);
        res.sendFile(out);
    });
});

app.get('/pump', function (req, res, next) {
    var db = '/home/pi/Development/data/pump.rrd';
    var out = '/home/pi/Development/data/pump.svg';

    var d = req.query.d || '-12h';
    var w = req.query.w || 800;
    var h = req.query.h || 300;
    var u = req.query.u || 8; 
    var l = req.query.l || -1;  

    var def = [ ];
    for (var i = 1; i<5; i++) {
        def.push('DEF:p' + i + '=' + db + ':p' + i + ':AVERAGE LINE:p' + i + '#0000FF');
    }

    var cmd = '/usr/bin/rrdtool graph ' + out + ' --start ' + d + ' --end now ' + def.join(' ') + ' -w ' + w + ' -h ' + h + ' -u ' + u + ' -l ' + l + ' -r -a SVG';

    exec(cmd, (err, stdout, stderr) => {
        if (err) 
            res.status(500).send(err);
        res.sendFile(out);
    });
});


app.get('/ec', function (req, res, next) {
    var db = '/home/pi/Development/data/cond2.rrd';
    var out = '/home/pi/Development/data/cond2.svg';

    var d = req.query.d || '-24h';
    var w = req.query.w || 800;
    var h = req.query.h || 500;
    var u = req.query.u || 550;
    var l = req.query.l || 500;  

    var cmd = '/usr/bin/rrdtool graph ' + out + ' --start ' + d + ' --end now DEF:ec=' + db + ':ec:AVERAGE LINE:ec#0000FF -w ' + w + ' -h ' + h + ' -u ' + u + ' -l ' + l + ' -r VDEF:eclast=ec,LAST "GPRINT:eclast:%.2lf" -a SVG';

    exec(cmd, (err, stdout, stderr) => {
        if (err) 
            res.status(500).send(err);
        res.sendFile(out);
    });
});

app.get('/ph', function (req, res, next) {
    var db = '/home/pi/Development/data/ph2.rrd';
    var out = '/home/pi/Development/data/ph2.svg';

    var d = req.query.d || '-24h';
    var w = req.query.w || 800;
    var h = req.query.h || 500;
    var u = req.query.u || 10;
    var l = req.query.l || 4;  

    var cmd = '/usr/bin/rrdtool graph ' + out + ' --start ' + d + ' --end now DEF:ph=' + db + ':ph:AVERAGE LINE:ph#0000FF -w ' + w + ' -h ' + h + ' -u ' + u + ' -l ' + l + ' -r VDEF:phlast=ph,LAST "GPRINT:phlast:%.2lf" -a SVG';

    exec(cmd, (err, stdout, stderr) => {
        if (err) 
            res.status(500).send(err);
        res.sendFile(out);
    });
});

app.get('/temp', function (req, res, next) {
    var db = '/home/pi/Development/data/temperature2.rrd';
    var out = '/home/pi/Development/data/temperature2.svg';

    var d = req.query.d || '-24h';
    var w = req.query.w || 800;
    var h = req.query.h || 500;
    var u = req.query.u || 85;
    var l = req.query.l || 0;  

    var cmd = '/usr/bin/rrdtool graph ' + out + ' --start ' + d + ' --end now DEF:temp1=' + db + ':temp1:AVERAGE DEF:temp0=' + db + ':temp0:AVERAGE LINE2:temp1#0000FF:Tnk LINE2:temp0#ff0000:Env -w ' + w + ' -h ' + h + ' -u ' + u + ' -l ' + l + ' -r -a SVG';

    exec(cmd, (err, stdout, stderr) => {
        if (err) 
            res.status(500).send(err);
        res.sendFile(out);
    });
});

app.listen(3040);
