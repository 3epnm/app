import { BaseSensorCollection } from './BaseSensorCollection';
import { DistanceModel } from './DistanceModel';
import { default as Socket } from 'socket.io-client';

export const DistanceCollection = BaseSensorCollection.extend({
    url: function () {
      return this.host + ':3030/distance';
    },
  
    model: DistanceModel,
    comparator: 'time',
  
    initialize: function (models, options) {
      this.host = options.host;

      this.listenTo(this, 'sync', this.startSocket); 
    }, 
    
    startSocket: function () {
      this.stopSocket();
      
      this.socket = Socket(this.host + ':3000/distance');
      
      this.listenTo(this, 'add', this.doShift);
  
      this.socket.on('connect', () => this.connected = true);
      this.socket.on('distance',  data => this.add(new DistanceModel(data)));
      this.socket.on('disconnect', () => this.connected = false);
    },
  
    stopSocket: function () {
      if (!this.socket) return;
  
      this.stopListening(this, 'add', this.doShift);
  
      this.socket.close();
    },
  
    getSeries: function (sensor, unit) {
      return this.map((model) => {
        return model.getData(sensor, unit)
      });
    }
  });