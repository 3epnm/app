import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';

export const DistanceModel = Backbone.Model.extend({
    idAttribute: 'time',

    translate: function (dist) {
        let cm = [
            31.7, 30.2, 29.5, 28.3, 26.7,
            25.6, 24.9, 23.8, 22.3, 21.7,
            20.7, 19.7, 18.2, 17.2, 16.2, 
            15.2, 14.7, 13.7, 12.3, 11.4
        ];

        let liter = _.map(cm, (cm, ind) => {
            return { liter: ind, cm: cm };
        });

        let closest = _.filter(liter, (item, index) => {
            try {
                if (
                    (dist <= item.cm && dist > liter[index+1].cm)
                 || (dist >= item.cm && dist < liter[index-1].cm)
               ) {
                   return true;
               }
               return false;
            } catch (e) {
              return false;
            }
        });

        let min = _.min(closest, item => item.liter);
        let max = _.max(closest, item => item.liter);

        if (min.cm == dist) {
            return min.liter;
        }

        let a = 1 / (min.cm - max.cm);
        let b = min.cm - dist;
        let res = min.liter + (a * b); 
        
        if (false && _.isNaN(res)) {
            console.log({
                in: dist,
                min: min,
                max: max,
                a: a,
                b: b,
                res: res
            });
        }

        return res; 
    },

    getData: function (sensor, unit) {
        function precisionRound(number, precision) {
            var factor = Math.pow(10, precision);
            return Math.round(number * factor) / factor;
        }

        let y = precisionRound(this.get('distance'), 1);

        if (unit == 'liter') {
            y = precisionRound(this.translate(y), 1);
        }

        return {
            x: new Date(this.get('time') * 1000),
            y: y
        }
    }
});