import { default as _ } from 'underscore';
import { default as Mn } from 'backbone.marionette';
import { default as template } from './timedSwitchView.hbs';

export const TimedSwitchView = Mn.View.extend({
    template: template,
    tagName: 'tr',

    events: {
        'change input': 'onSwitchToggle'
    },

    modelEvents: {
        'change:state': 'onStateChanged'
    },

    onStateChanged: function () {
        if (this.model.get('sender') == 'socket') {
            this.render();
        }
    },

    onSwitchToggle: function () {
        let $timeout = this.$el.find('#list-switch-' + this.model.get('gpio') + '-timeout');
        let $speed = this.$el.find('#list-switch-' + this.model.get('gpio') + '-speed');

        if (this.$el.find('input').is(":checked")) {
            this.model.set({ sender: 'gui', state: 'high', timeout: $timeout.val(), speed: $speed.val() });
        } else {
            this.model.set({ sender: 'gui', state: 'low' });
        }
    },

    templateContext: function () {
        return {
            checked: this.model.get('state') == 'high' ? ' checked' : '',
            label: this.getOption('label')
        }
    },

    onRender: function () {
        componentHandler.upgradeElement(this.$el.find('.mdl-js-switch')[0]);
    }
});