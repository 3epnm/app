import { default as Mn } from 'backbone.marionette';
import { SensorModel } from '../models/SensorModel';
import { SensorView } from './SensorView';

import { SwitchesModel } from '../models/SwitchesModel';
import { SwitchesLayout } from './SwitchesLayout';

import { TimedSwitchesModel } from '../models/TimedSwitchesModel';
import { TimedSwitchesLayout } from './TimedSwitchesLayout';

export const Dashboard = Mn.CollectionView.extend({
    className: 'dashboard',
  
    childView: function (model) {
      if (model instanceof SensorModel) {
        return SensorView;
      } else if (model instanceof SwitchesModel) {
        return SwitchesLayout;
      } else if (model instanceof TimedSwitchesModel) {
        return TimedSwitchesLayout;
      }
    }
  });