import { default as _ } from 'underscore';
import { default as Backbone } from 'backbone';
import { default as Mn } from 'backbone.marionette';
import { default as template } from './svgView.hbs';

export const SvgView = Mn.View.extend({
    template: template,
    onRender: function () {
        Backbone.$.get(this.model.get('path'), (data, status, xhr) => {
            var svg = xhr.responseXML.documentElement;
            svg = document.importNode(svg, true); // surprisingly optional in these browsers
            this.$el.find('.svg_content')[0].appendChild(svg);    
        
            //this.$el.find('.content')[0].appendChild(data);
        });
    }
});