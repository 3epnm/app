import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';

export const GpioModel = Backbone.Model.extend({
    idAttribute: 'gpio',
    defaults: {
        sender: null
    },

    getData: function () {
        return _.omit(this.toJSON(), 'sender');
    }
});