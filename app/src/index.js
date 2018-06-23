import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';
import { default as Mn } from 'backbone.marionette';

import { default as dashboard_item_template } from './dashboard_item_template.hbs';
import { default as moment } from 'moment';

import { SensorModel } from './models/SensorModel';
import { SwitchesModel } from './models/SwitchesModel';
import { TimedSwitchesModel } from './models/TimedSwitchesModel';

import { GpioCollection } from './models/GpioCollection';
import { TimedGpioCollection } from './models/TimedGpioCollection';
import { TemperatureCollection } from './models/TemperatureCollection';
import { DistanceCollection } from './models/DistanceCollection';
import { PhCollection } from './models/PhCollection';
import { ConductivityCollection } from './models/ConductivityCollection';

import { SensorView } from './views/SensorView';
import { Dashboard } from './views/DashBoard';
import { SwitchesLayout } from './views/SwitchesLayout';
import { TimedSwitchesLayout } from './views/TimedSwitchesLayout';

import { SvgView } from './views/SvgView';

import { 
  switchesModel, distanceSensorModel, literSensorModel, temperatureSensorModel, 
  phSensorModel, conductivitySensorModel, ecSensorModel,
  tdsSensorModel, salSensorModel, temperature0SensorModel, temperature1SensorModel,
  dashboardCollection, qualityCollection, temperatureCollection,
  timedSwitchesModel, switchesCollection, literCollection } from './init';

const MainController = Mn.Object.extend({
  showDashboard: function () {
    const layout = this.getOption('layout');
    
    let view = new Dashboard({
      collection: dashboardCollection
    });

    layout.showView(view);
  },

  showQuality: function () {
    const layout = this.getOption('layout');
    
    let view = new Dashboard({
      collection: qualityCollection
    });

    layout.showView(view);
  },

  showTemperature: function () {
    const layout = this.getOption('layout');
    
    // let view = new Dashboard({
    //   collection: temperatureCollection
    // });

    let view = new SvgView({
      model: new Backbone.Model({
        path: 'http://192.168.1.217:3040/temp?h=300&d=-24h&u=30&l=10'
      })
    })

    layout.showView(view);
  },

  showRelay: function () {
    const layout = this.getOption('layout');

    let view = new Dashboard({
      collection: switchesCollection
    });

    layout.showView(view);
  },

  showPump: function () {
    const layout = this.getOption('layout');

    let view = new Dashboard({
      collection: literCollection
    })

    layout.showView(view);
  },

  showPh: function () {
    const layout = this.getOption('layout');

    let view = new SvgView({
      model: new Backbone.Model({
        path: 'http://192.168.1.217:3040/ph?h=300&d=-24h&u=9&l=4'
      })
    })

    layout.showView(view);
  },

  showConductivity: function () {
    const layout = this.getOption('layout');

    let view = new SensorView({
      model: conductivitySensorModel
    })

    layout.showView(view);
  }
});

var Router = Mn.AppRouter.extend({
  initialize: function (options) {
    this.controller = new MainController(options);
  },

  appRoutes: {
    'sensors': 'showTemperature',
    'relays': 'showRelay',
    'pumps': 'showPump',
    'ph': 'showPh',
    'conductivity': 'showConductivity',
    'dashboard': 'showDashboard',
    'quality': 'showQuality',
    '': 'showDashboard'
  }
});

var App = Mn.Application.extend({
  region: '.page-content',

  onStart: function() {
    const router = new Router({
      layout: this
    });

    Backbone.history.start();
  }
});

var app = new App();

const host = 'http://' + location.hostname;

var temperature = new TemperatureCollection(null, { host: host });
temperatureSensorModel.set('data', temperature);
temperature0SensorModel.set('data', temperature);
temperature1SensorModel.set('data', temperature);

var distance = new DistanceCollection(null, { host: host });
distanceSensorModel.set('data', distance);
literSensorModel.set('data', distance);

var ph = new PhCollection(null, { host: host });
phSensorModel.set('data', ph);

var conductivity = new ConductivityCollection(null, { host: host });
conductivitySensorModel.set('data', conductivity);
ecSensorModel.set('data', conductivity);
tdsSensorModel.set('data', conductivity);
salSensorModel.set('data', conductivity);

var gpio = new GpioCollection(null, { host: host });
switchesModel.set('data', gpio);

var timedgpio = new TimedGpioCollection([
  { gpio: "A", state: "low", timeout: 1, speed: 255 },
  { gpio: "B", state: "low", timeout: 1, speed: 255 },
  { gpio: "C", state: "low", timeout: 1, speed: 255 },
  { gpio: "D", state: "low", timeout: 1, speed: 255 }
], { 
  host: host 
});

timedSwitchesModel.set('data', timedgpio);
timedgpio.startSocket();

Backbone.$.when(
  gpio.fetch(), temperature.fetch(), distance.fetch(), 
  ph.fetch(), conductivity.fetch()).done(() => app.start());

window.collections = {
  temperature: temperature,
  distance: distance,
  ph: ph,
  conductivity: conductivity
}