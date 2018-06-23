import { default as Mn } from 'backbone.marionette';
import { TimedSwitchView } from './TimedSwitchView';

export const TimedSwitchesView = Mn.CollectionView.extend({
    tagName: 'tbody',
    childView: TimedSwitchView,

    childViewOptions: function (model, index) {
      return {
        label: this.model.get('channelNames')[model.get('gpio')]
      }
    }
});