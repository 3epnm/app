import { default as Mn } from 'backbone.marionette';
import { SensorModel } from '../models/SensorModel';
import { SensorView } from './SensorView';

export const Dashboard = Mn.CollectionView.extend({
    className: 'dashboard',
  
    childView: function (model) {
      if (model instanceof SensorModel) {
        return SensorView;
      } else {
//        return DashboardItem;
      }
    }
  });