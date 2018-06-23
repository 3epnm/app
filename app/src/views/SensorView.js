import { default as _ } from 'underscore';
import { default as Mn } from 'backbone.marionette';
import { default as template } from './sensorView.hbs';
import { default as Chart } from 'chart.js';
import { default as moment } from 'moment';
import { default as uuidv4 } from 'uuid/v4';

export const SensorView = Mn.View.extend({
    template: template,
    className: 'sensor-card-wide mdl-card mdl-shadow--2dp',

    modelEvents: {
      'change:min': 'render',
      'change:max': 'render',
      'change:time': 'fetchData'
    },

    events: {
      'click .settings': 'showSettings',
      'click .close-settings': 'closeSettings',
      'click .save-settings': 'saveSettings'
    },

    showSettings: function () {
      this.$el.addClass('settings');
    },

    closeSettings: function () {
      this.$el.removeClass('settings');
    },

    saveSettings: function () {
      let rangeFrom = this.$el.find('.range-from').val();
      let rangeTo = this.$el.find('.range-to').val();
      let rangeTime = this.$el.find('.time-range').val();

      this.model.set({
        min: rangeFrom,
        max: rangeTo,
        time: rangeTime
      });

      this.$el.removeClass('settings');
    },

    fetchData: function () {
      this.model.get('data')
        .fetch({ data: {
          duration: this.model.get('time') * 60
        }})
        .done(() => this.render());
    },

    doInitialize: function () {
      this.collection = this.model.get('data');

      let ticks = (this.model.has('min') && this.model.has('max')) && {
        min: Number(this.model.get('min')),
        max: Number(this.model.get('max'))
      };

      let yAxes = this.model.get('yAxes') || ticks && [{
        ticks: ticks
      }];

      this.graphConfig = {
        type: 'line',
        data: { 
          datasets: [] 
        },
        options: {
          animation: {
            duration: 0
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'minute',
                min: moment().subtract(Number(this.model.get('time') || 5), 'minutes'),
                max: moment(),
                displayFormats: {
                  minute: 'mm'
                }
              }
            }],
            yAxes: yAxes
          }
        }
      };
  
      _.each(this.model.get('sensors'), item => {
        let series = { 
          label: item.label || item.name,
          data: this.collection.getSeries(item.name, this.model.get('unit')),
          borderColor: item.color,
          lineTension: 0,
          pointRadius: item.pointRadius || 0,
          borderWidth: 2,
          fill: false
        };

        if (item.id) {
          series.yAxisID = item.id;
        }

        this.graphConfig.data.datasets.push(series);
      });
    },
  
    update: function (model) {
      if (!this.chart) return;

      this.chart.options.scales.xAxes[0].time.min = moment().subtract(this.model.get('time') || 5, 'minutes');
      this.chart.options.scales.xAxes[0].time.max = moment();

      let text = [];
      _.each(this.model.get('sensors'), (item, ind) => {
        this.chart.data.datasets[ind].data = this.collection.getSeries(item.name, this.model.get('unit'));
        text.push(this.collection.last().getData(item.name, this.model.get('unit')).y + item.unit);
      });
      this.$el.find('.lastValue').html(text.join(', '));
      this.chart.update();
    },
  
    onRender: function () {
      this.doInitialize();

      componentHandler.upgradeElement(this.$el.find('.mdl-js-switch')[0]);

      var ctx = this.$el.find('.chart')[0].getContext('2d');
      this.chart = new Chart(ctx, this.graphConfig);
  
      if (this.collection.length > 0) {
        let text = [];
        _.each(this.model.get('sensors'), (item, ind) => {
          text.push(this.collection.last().getData(item.name, this.model.get('unit')).y + item.unit);
        });
        this.$el.find('.lastValue').html(text.join(', '));
      }

      this.listenTo(this.collection, 'add', this.update);
    },

    templateContext: function () {
      return {
        uuid: uuidv4(),
        checked: ' checked="checked"'
      }
    }
  });