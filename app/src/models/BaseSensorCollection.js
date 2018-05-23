import { default as Backbone } from 'backbone';

export const BaseSensorCollection = Backbone.Collection.extend({
    doShift: function () {
        if (this.length > 1000) {
          this.shift();
        }
    }  
});