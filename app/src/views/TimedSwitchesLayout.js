import { default as _ } from 'underscore';
import { default as Mn } from 'backbone.marionette';
import { default as template } from './timedSwitchesLayout.hbs';
import { TimedSwitchesView } from './TimedSwitchesView';

export const TimedSwitchesLayout = Mn.View.extend({
    template: template,
    className: 'dashbord-card-wide timedswitches-layout mdl-card mdl-shadow--2dp',

    regions: {
        main: {
            el: 'tbody',
            replaceElement: true
        }
    },

    modelEvents: {
        'change:data': 'render'
    },

    onRender: function() {
        if (this.model.has('data')) {
            this.showChildView('main', new TimedSwitchesView({
                collection: this.model.get('data'),
                model: this.model
            }));
        }
    }
});