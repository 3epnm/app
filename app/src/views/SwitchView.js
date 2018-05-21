import { default as _ } from 'underscore';
import { default as Mn } from 'backbone.marionette';
import { default as template } from './switchView.hbs';

export const SwitchView = Mn.View.extend({
    template: template,
    className: 'mdl-list__item',
    tagName: 'li',

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
        if (this.$el.find('input').is(":checked")) {
            this.model.set({ sender: 'gui', state: 'high' });
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