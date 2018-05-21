import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';
import { default as Mn } from 'backbone.marionette';

import { default as dashboard_item_template } from './dashboard_item_template.hbs';
import { default as moment } from 'moment';

import { SensorModel } from './models/SensorModel';
import { SwitchesModel } from './models/SwitchesModel';

import { GpioCollection } from './models/GpioCollection';
import { TemperatureCollection } from './models/TemperatureCollection';
import { DistanceCollection } from './models/DistanceCollection';
import { PhCollection } from './models/PhCollection';
import { ConductivityCollection } from './models/ConductivityCollection';

import { SensorView } from './views/SensorView';
import { Dashboard } from './views/DashBoard';
import { SwitchesLayout } from './views/SwitchesLayout';

import { 
  switchesModel, distanceSensorModel, temperatureSensorModel, 
  phSensorModel, conductivitySensorModel, ecSensorModel,
  tdsSensorModel, salSensorModel,
  dashboardCollection, qualityCollection } from './init';

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

  showSensor: function () {
    const layout = this.getOption('layout');

    let view = new SensorView({
      model: temperatureSensorModel
    })

    layout.showView(view);
  },

  showRelay: function () {
    const layout = this.getOption('layout');

    let view = new SwitchesLayout({
      model: switchesModel
    });

    layout.showView(view);
  },

  showPump: function () {
    const layout = this.getOption('layout');

    let view = new SensorView({
      model: distanceSensorModel
    })

    layout.showView(view);
  },

  showPh: function () {
    const layout = this.getOption('layout');

    let view = new SensorView({
      model: phSensorModel
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
    'sensors': 'showSensor',
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

var distance = new DistanceCollection(null, { host: host });
distanceSensorModel.set('data', distance);

var ph = new PhCollection(null, { host: host });
phSensorModel.set('data', ph);

var conductivity = new ConductivityCollection(null, { host: host });
conductivitySensorModel.set('data', conductivity);
ecSensorModel.set('data', conductivity);
tdsSensorModel.set('data', conductivity);
salSensorModel.set('data', conductivity);

var gpio = new GpioCollection(null, { host: host });
switchesModel.set('data', gpio);

Backbone.$.when(
  gpio.fetch(), temperature.fetch(), distance.fetch(), 
  ph.fetch(), conductivity.fetch()).done(() => app.start());

window.collections = {
  temperature: temperature,
  distance: distance,
  ph: ph,
  conductivity: conductivity
}