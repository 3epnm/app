import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';
import { default as Mn } from 'backbone.marionette';

import { default as dashboard_item_template } from './dashboard_item_template.hbs';
import { default as moment } from 'moment';

import { SensorModel } from './models/SensorModel';

import { TemperatureCollection } from './models/TemperatureCollection';
import { DistanceCollection } from './models/DistanceCollection';

import { SensorView } from './views/SensorView';
import { Dashboard } from './views/DashBoard';

import { distanceSensorModel, temperatureSensorModel, dashboardCollection } from './init';

const MainController = Mn.Object.extend({
  showDashboard: function () {
    const layout = this.getOption('layout');
    
    let view = new Dashboard({
      collection: dashboardCollection
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

  },

  showPump: function () {
    const layout = this.getOption('layout');

    let view = new SensorView({
      model: distanceSensorModel
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
    'dashboard': 'showDashboard',
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

var temperature = new TemperatureCollection();
temperatureSensorModel.set('data', temperature);

var distance = new DistanceCollection();
distanceSensorModel.set('data', distance);

Backbone.$.when(temperature.fetch(), distance.fetch()).done(() => app.start());
