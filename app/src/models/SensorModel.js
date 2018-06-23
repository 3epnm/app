import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';
import { LocalStorage } from 'backbone.localstorage';

export const SensorModel = Backbone.Model.extend({ 
    localStorage: new LocalStorage('SensorModel'),

    defaults: {
        time: 5
    },

    get: function (name, options) {
        if (name == "data") {
            return this.data;
        }

        return Backbone.Model.prototype.get.call(this, name, options)
    },

    set: function (name, value, options) {
        if (name == "data") {
            return this.data = value;
        }

        return Backbone.Model.prototype.set.call(this, name, value, options)
    },

    initialize: function () {
        this.listenTo(this, 'change', model => {
            if (model.changed.data === undefined) {
                this.save();
            }
        });
    }
});