import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';

export const TimedGpioModel = Backbone.Model.extend({
    idAttribute: 'gpio',
    defaults: {
        sender: null,
        timeout: 0,
        speed: 255
    },

    getData: function () {
        return _.omit(this.toJSON(), 'sender');
    }
});