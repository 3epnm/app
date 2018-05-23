import { BaseSensorCollection } from './BaseSensorCollection';
import { TemperatureModel } from './TemperatureModel';
import { default as Socket } from 'socket.io-client';

export const TemperatureCollection = BaseSensorCollection.extend({
    url: function () {
      return this.host + ':3030/temperature';
    },

    model: TemperatureModel,
    comparator: 'time',
  
    initialize: function (models, options) {
      this.host = options.host;
      
      this.listenTo(this, 'sync', this.startSocket);
    }, 

    startSocket: function () {
      this.socket = Socket(this.host + ':3000/temperature');
      
      this.listenTo(this, 'add', this.doShift);
  
      this.socket.on('connect', () => this.connected = true);
      this.socket.on('temperature',  data => this.add(new TemperatureModel(data)));
      this.socket.on('disconnect', () => this.connected = false);
    },
  
    stopSocket: function () {
      if (!this.socket) return;
  
      this.stopListening(this, 'add', this.doShift);
  
      this.socket.close();
    },
  
    getSeries: function (sensor) {
      return this.map((model) => {
        return model.getData(sensor)
      });
    }
  });