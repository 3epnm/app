import { default as _ } from 'underscore';
import { default as Mn } from 'backbone.marionette';
import { default as template } from './sensorView.hbs';
import { default as Chart } from 'chart.js';
import { default as moment } from 'moment';

export const SensorView = Mn.View.extend({
    template: template,
    className: 'sensor-card-wide mdl-card mdl-shadow--2dp',

    initialize: function () {
      this.collection = this.model.get('data');

      let ticks = (this.model.has('min') && this.model.has('max')) && {
        min: this.model.get('min'),
        max: this.model.get('max')
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
                min: moment().subtract(5, 'minutes'),
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
          label: item.name,
          data: this.collection.getSeries(item.name),
          borderColor: item.color,
          lineTension: 0,
          pointRadius: 0,
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

      this.chart.options.scales.xAxes[0].time.min = moment().subtract(2, 'minutes');
      this.chart.options.scales.xAxes[0].time.max = moment();

      let text = [];
      _.each(this.model.get('sensors'), (item, ind) => {
        this.chart.data.datasets[ind].data = this.collection.getSeries(item.name);
        text.push(this.collection.last().getData(item.name).y + item.unit);
      });
      this.$el.find('.lastValue').html(text.join(', '));
      this.chart.update();
    },
  
    onRender: function () {
      var ctx = this.$el.find('.chart')[0].getContext('2d');
      this.chart = new Chart(ctx, this.graphConfig);
  
      if (this.collection.length > 0) {
        let text = [];
        _.each(this.model.get('sensors'), (item, ind) => {
          text.push(this.collection.last().getData(item.name).y + item.unit);
        });
        this.$el.find('.lastValue').html(text.join(', '));
      }

      this.listenTo(this.collection, 'add', this.update);
    }
  });