import { default as Backbone } from 'backbone';
import { DistanceModel } from './DistanceModel';
import { default as Socket } from 'socket.io-client';

export const DistanceCollection = Backbone.Collection.extend({
    url: 'http://192.168.1.99:3030/distance',
    model: DistanceModel,
    comparator: 'time',
  
    initialize: function () {
      this.listenTo(this, 'sync', this.startSocket); 
    }, 
  
    startSocket: function () {
      this.socket = Socket('http://192.168.1.99:3000/distance');
      
      this.listenTo(this, 'add', this.shift);
  
      this.socket.on('connect', () => this.connected = true);
      this.socket.on('distance',  data => this.add(new DistanceModel(data)));
      this.socket.on('disconnect', () => this.connected = false);
    },
  
    stopSocket: function () {
      if (!this.socket) return;
  
      this.stopListening(this, 'add', this.shift);
  
      this.socket.close();
    },
  
    getSeries: function (sensor) {
      return this.map((model) => {
        return model.getData(sensor)
      });
    }
  });