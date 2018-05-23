import { BaseSensorCollection } from './BaseSensorCollection';
import { MergeSensorModel } from './MergeSensorModel';

export const MergeSensorCollection = BaseSensorCollection.extend({
  model: MergeSensorModel
});