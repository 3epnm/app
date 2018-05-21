import { default as Backbone } from 'backbone';
import { PhModel } from './PhModel';
import { default as Socket } from 'socket.io-client';

export const PhCollection = Backbone.Collection.extend({
    url: function () {
      return this.host + ':3030/ph';
    },

    model: PhModel,
    comparator: 'time',
  
    initialize: function (models, options) {
      this.host = options.host;

      this.listenTo(this, 'sync', this.startSocket); 
    }, 
  
    doShift: function () {
      if (this.length > 100) {
        this.shift();
      }
    },

    startSocket: function () {
      this.socket = Socket(this.host + ':3000/ph');
      
      this.listenTo(this, 'add', this.doShift);
  
      this.socket.on('connect', () => this.connected = true);
      this.socket.on('ph',  data => this.add(new PhModel(data)));
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