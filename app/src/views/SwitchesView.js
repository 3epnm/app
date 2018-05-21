import { default as Mn } from 'backbone.marionette';
import { SwitchView } from './SwitchView';

export const SwitchesView = Mn.CollectionView.extend({
    className: 'switches mdl-list',
    tagName: 'ul',
    childView: SwitchView,

    childViewOptions: function (model, index) {
        return {
          label: this.model.get('channelNames')[model.get('gpio')]
        }
      }
  });