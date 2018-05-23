import { default as Backbone } from 'backbone';

export const DistanceModel = Backbone.Model.extend({
    idAttribute: 'time',

    translate: function () {
        let literToCm = [
            31.7, 30.2, 29.5, 28.3, 26.7,
            25.6, 24.9, 23.8, 22.3, 21.7,
            20.7, 19.7, 18.2, 17.2, 16.2, 
            15.2, 14.7, 13.7, 12.3, 11.4
        ]
    },

    getData: function (sensor) {
        function precisionRound(number, precision) {
            var factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        }

        return {
            x: new Date(this.get('time') * 1000),
            y: precisionRound(this.get('distance'), 1)
        }
    }
});