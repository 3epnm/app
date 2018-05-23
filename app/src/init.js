import { DashboardCollection } from './models/DashboardCollection';
import { SensorModel } from './models/SensorModel';
import { SwitchesModel } from './models/SwitchesModel';

export const dashboardCollection = new DashboardCollection();
export const qualityCollection = new DashboardCollection();

export const distanceSensorModel = new SensorModel({
    'title': 'Distance',
    'min': 10,
    'max': 35,
    'sensors': [{
        'color': '#0000ff',
        'name': 'distance',
        'unit': ' cm'
    }]
}); 

export const phSensorModel = new SensorModel({
    'title': 'Ph',
    'min': 0,
    'max': 14,
    'sensors': [{
        'color': '#ff0000',
        'name': 'ph',
        'unit': ''
    }]
}); 

export const temperatureSensorModel = new SensorModel({
    'title': 'Temperatures',
    'min': 20,
    'max': 30,
    'sensors': [{
        'color': '#00ff00',
        'name': '28FF8C56911501BD',
        'unit': '&#8451;'
    }, {
        'color': '#00ffff',
        'name': '28FFE356911501C3',
        'unit': '&#8451;'
    }]
})

export const switchesModel = new SwitchesModel({
    'title': 'Switches',
    'channelNames': {
        'A': 'not set',
        'B': 'not set',
        'C': 'circulating pump',
        'D': 'feed left',
        'E': 'feed right',
        'F': 'injection pump',
        'G': 'not set',
        'H': 'fill pump'
    }
})

export const conductivitySensorModel = new SensorModel({
    'title': 'Conductivity',
    'min': 0,
    'max': 10000,
    'yAxes': [{
        'id': 'left-y-axis1',
        'type': 'linear',
        'position': 'left'
    }, {
        'id': 'left-y-axis2',
        'type': 'linear',
        'position': 'left'
    }, {
        'id': 'right-y-axis',
        'type': 'linear',
        'position': 'right',
        // 'ticks': {
        //     'min': 0,
        //     'max': 10
        // }
    }],
    'sensors': [{
        'id': 'left-y-axis1',        
        'color': '#ff0000',
        'name': 'ec',
        'unit': ' µS/cm'
    }, {
        'id': 'left-y-axis2',        
        'color': '#00ff00',
        'name': 'tds',
        'unit': ' ppm'
    }, {
        'id': 'right-y-axis',
        'color': '#0000ff',
        'name': 'sal',
        'unit': ' PSU'
    }]
})

export const salSensorModel = new SensorModel({
    'title': 'Sal',
    // 'min': 4,
    // 'max': 8,
    'sensors': [{      
        'color': '#0000ff',
        'name': 'sal',
        'unit': ' PSU'
    }]
});

export const tdsSensorModel = new SensorModel({
    'title': 'Tds',
    'time': 5,
    // 'min': 4,
    // 'max': 8,
    'sensors': [{      
        'color': '#00ff00',
        'name': 'tds',
        'unit': ' ppm'
    }]
});

export const ecSensorModel = new SensorModel({
    'title': 'Ec',
    'time': 20,
    // 'min': 4,
    // 'max': 8,
    'sensors': [{    
        'color': '#ff0000',
        'name': 'ec',
        'unit': ' µS/cm'
    }]
});

dashboardCollection.add(distanceSensorModel);
dashboardCollection.add(temperatureSensorModel);
dashboardCollection.add(phSensorModel);
dashboardCollection.add(conductivitySensorModel);
dashboardCollection.add(switchesModel);

qualityCollection.add(phSensorModel);
qualityCollection.add(ecSensorModel);
qualityCollection.add(tdsSensorModel);
// qualityCollection.add(salSensorModel);
qualityCollection.add(switchesModel);