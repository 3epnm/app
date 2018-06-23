var cron = require("node-cron");
var redis = require("redis");
var moment = require("moment");
var rrdtool = require("rrdtool");
var _ = require("underscore");

var redis_publish = redis.createClient();

cron.schedule('0 */6 * * *', function() {
    redis_publish.publish('gpio:set', JSON.stringify({ gpio: 'C', state: 'high' }));
    console.log('C HIGH', moment().format('LTS'))

    setTimeout(function () {
        redis_publish.publish('gpio:set', JSON.stringify({ gpio: 'C', state: 'low' }));  
        console.log('C LOW', moment().format('LTS'))      
    }, 1000 * 60 * 5);
});

cron.schedule('*/2 * * * * *', function() {
    redis_publish.publish('ph:read', JSON.stringify({ read: true }));
    // console.log('PH', moment().format('LTS'))
});

cron.schedule('*/2 * * * * *', function() {
    setTimeout(function () {
       redis_publish.publish('ec:read', JSON.stringify({ read: true }));
       // console.log('EC', moment().format('LTS'))
    }, 1000);
});

var switch_states = {
    A: { name: "sw1", state: false, falsy: 0, truesy: 1 },
    B: { name: "sw2", state: false, falsy: 2, truesy: 3 },
    C: { name: "sw3", state: false, falsy: 4, truesy: 5 },
    D: { name: "sw4", state: false, falsy: 6, truesy: 7 },
    E: { name: "sw5", state: false, falsy: 8, truesy: 9 },
    F: { name: "sw6", state: false, falsy: 10, truesy: 11 },
    G: { name: "sw7", state: false, falsy: 12, truesy: 13 },
    H: { name: "sw8", state: false, falsy: 14, truesy: 15 },
}

var db1 = rrdtool.open('../data/relais.rrd');

var write_switch_states = function () {
    let values = {};
    _.each(switch_states, function (sw) {
        let type = sw.state === true ? 'truesy' : 'falsy';
        values[sw.name] = sw[type]; 
    });
    db1.update(values);
}

cron.schedule('* * * * * *', function() {
    write_switch_states();
});

var redis_client_switches = redis.createClient();

redis_client_switches.on('message', function (channel, message) {
    message = JSON.parse(message);

    if (message.state === 'low') {
        switch_states[message.gpio].state = false;
    } else {
        switch_states[message.gpio].state = true;
    }
});

redis_client_switches.subscribe('gpio:state');

/*
var pump_states = {
    A: { name: "p1", state: false, falsy: 0, truesy: 1 },
    B: { name: "p2", state: false, falsy: 2, truesy: 3 },
    C: { name: "p3", state: false, falsy: 4, truesy: 5 },
    D: { name: "p4", state: false, falsy: 6, truesy: 7 }
}

var db2 = rrdtool.open('../data/pump.rrd');

var write_pump_states = function () {
    let values = {};
    _.each(pump_states, function (sw) {
        let type = sw.state === true ? 'truesy' : 'falsy';
        values[sw.name] = sw[type]; 
    });
    console.log(values)
    db2.update(values);
}

// cron.schedule('* * * * * *', function() {
//    write_pump_states();
// });

var redis_client_pumps = redis.createClient();

redis_client_pumps.on('message', function (channel, message) {
    message = JSON.parse(message);
    if (message.state === 'low') {
        pump_states[message.gpio].state = false;
    } else {
        pump_states[message.gpio].state = true;
    }

    write_pump_states();
});

redis_client_pumps.subscribe('timedgpio:state');
*/
