import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';
import { TimedGpioModel } from './TimedGpioModel';
import { default as Socket } from 'socket.io-client';

export const TimedGpioCollection = Backbone.Collection.extend({
    url: function () {
      return this.host + ':3030/timedgpio';
    },

    model: TimedGpioModel,
    comparator: 'gpio',

    initialize: function (models, options) {
      this.host = options.host;

      this.listenTo(this, 'sync', this.startSocket);
    }, 
  
    startSocket: function () {
      this.socket = Socket(this.host + ':3000/timedgpio');
      
      this.socket.on('connect', () => this.connected = true);
      this.socket.on('timedgpio',  data => this.updateStateSocket(data));
      this.socket.on('disconnect', () => this.connected = false);
    
      this.listenTo(this, 'change:state', model => {
        if (model.get('sender') == 'gui') {
          this.socket.emit('timedgpio', model.getData());
        }
      });
    },
  
    stopSocket: function () {
      if (!this.socket) return;
  
      this.socket.close();
    },

    updateStateSocket: function (data) {
        this.add(_.extend({ sender: 'socket' }, data), { merge: true });
    }
  });