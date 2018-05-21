import { default as _ } from 'underscore';
import { default as Mn } from 'backbone.marionette';
import { default as template } from './switchesLayout.hbs';
import { SwitchesView } from './SwitchesView';

export const SwitchesLayout = Mn.View.extend({
    template: template,
    className: 'dashbord-card-wide mdl-card mdl-shadow--2dp',

    regions: {
        main: '.mdl-card__title'
    },

    modelEvents: {
        'change:data': 'render'
    },

    onRender: function() {
        if (this.model.has('data')) {
            this.showChildView('main', new SwitchesView({
                collection: this.model.get('data'),
                model: this.model
            }));
        }
    }
});