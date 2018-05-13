import { default as Backbone } from 'backbone';

export const TemperatureModel = Backbone.Model.extend({
    idAttribute: 'time',

    getData: function (sensor) {
        function precisionRound(number, precision) {
            var factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        }

        return {
            x: new Date(this.get('time') * 1000),
            y: precisionRound(this.get(sensor), 2)
        }
    }
});