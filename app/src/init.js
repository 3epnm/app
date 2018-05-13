import { DashboardCollection } from './models/DashboardCollection';
import { SensorModel } from './models/SensorModel';

export const dashboardCollection = new DashboardCollection();
export const distanceSensorModel = new SensorModel({
    'title': 'Distance',
    'unit': ' cm',
    'sensors': [{
        'color': '#0000ff',
        'name': 'distance'
    }]
}); 

export const temperatureSensorModel = new SensorModel({
    'title': 'Temperatures',
    'unit': '&#8451;',
    'sensors': [{
        'color': '#00ff00',
        'name': '28FF8C56911501BD'
    }, {
        'color': '#00ffff',
        'name': '28FFE356911501C3'
    }]
})

dashboardCollection.add(distanceSensorModel);
dashboardCollection.add(temperatureSensorModel);