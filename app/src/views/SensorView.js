import { default as _ } from 'underscore';
import { default as Mn } from 'backbone.marionette';
import { default as sensors_template } from './sensorView.hbs';
import { default as Chart } from 'chart.js';

export const SensorView = Mn.View.extend({
    template: sensors_template,
    className: 'sensor-card-wide mdl-card mdl-shadow--2dp',
  
    initialize: function () {
      this.collection = this.model.get('data');
  
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
              type: 'time'
            }]
          }
        }
      };
  
      _.each(this.model.get('sensors'), item => {
        this.graphConfig.data.datasets.push({ 
          label: item.name,
          data: this.collection.getSeries(item.name),
          borderColor: item.color,
          lineTension: 0,
          pointRadius: 0,
          borderWidth: 2,
          fill: false
        });
      });
    },
  
    update: function (model) {
      if (!this.chart) return;
  
      let text = [];
      _.each(this.model.get('sensors'), (item, ind) => {
        this.graphConfig.data.datasets[ind].data = this.collection.getSeries(item.name);
        text.push(this.collection.last().getData(item.name).y + this.model.get('unit'));
      });
      this.$el.find('.lastValue').html(text.join(', '));

      this.chart.update();
    },
  
    onRender: function () {
      var ctx = this.$el.find('.chart')[0].getContext('2d');
      this.chart = new Chart(ctx, this.graphConfig);
  
      let text = [];
      _.each(this.model.get('sensors'), (item, ind) => {
        text.push(this.collection.last().getData(item.name).y + this.model.get('unit'));
      });
      this.$el.find('.lastValue').html(text.join(', '));

      this.listenTo(this.collection, 'remove', this.update);
    }
  });