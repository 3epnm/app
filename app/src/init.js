import { DashboardCollection } from './models/DashboardCollection';
import { SensorModel } from './models/SensorModel';
import { SwitchesModel } from './models/SwitchesModel';
import { TimedSwitchesModel } from './models/TimedSwitchesModel';

export const dashboardCollection = new DashboardCollection();
export const qualityCollection = new DashboardCollection();
export const temperatureCollection = new DashboardCollection();
export const switchesCollection = new DashboardCollection();
export const literCollection = new DashboardCollection();

export const distanceSensorModel = new SensorModel({
    'id': 'disance',
    'title': 'Distance',
    'min': 10,
    'max': 35,
    'sensors': [{
        'color': '#0000ff',
        'name': 'distance',
        'unit': ' cm'
    }]
}); 

export const literSensorModel = new SensorModel({
    'id': 'liter',
    'title': 'Liter',
    'min': 0,
    'max': 20,
    'unit': 'liter',
    'sensors': [{
        'color': '#0000ff',
        'name': 'distance',
        'unit': ' l',
        'label': 'Liter'
    }]
}); 

export const phSensorModel = new SensorModel({
    'id': 'ph',
    'title': 'Ph',
    'min': 4,
    'max': 10,
    'sensors': [{
        'color': '#ff0000',
        'name': 'ph',
        'unit': ''
    }]
}); 

export const temperatureSensorModel = new SensorModel({
    'id': 'temperature',
    'title': 'Temperatures',
    'min': 20,
    'max': 30,
    'sensors': [{
        'color': '#0000ff',
        'name': '28FF8C56911501BD',
        'unit': '&#8451; Env'
    }, {
        'color': '#ff0000',
        'name': '28FFE356911501C3',
        'unit': '&#8451; Tank'
    }]
});

export const temperature0SensorModel = new SensorModel({
    'id': 'enviroment',
    'title': 'Enviroment',
    'min': 20,
    'max': 30,
    'sensors': [{
        'color': '#00ff00',
        'name': '28FF8C56911501BD',
        'unit': '&#8451;'
    }]
});


export const temperature1SensorModel = new SensorModel({
    'id': 'tank',
    'title': 'Tank',
    'min': 20,
    'max': 30,
    'sensors': [{
        'color': '#ff0000',
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

export const timedSwitchesModel = new TimedSwitchesModel({
    'title': 'TimedSwitches',
    'channelNames': {
        'A': 'Component A',
        'B': 'Component B',
        'C': 'PH Up',
        'D': 'PH Down'
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
    'id': 'sal',
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
    'id': 'tds',
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
    'id': 'ec',
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

literCollection.add(distanceSensorModel);
literCollection.add(literSensorModel);
literCollection.add(switchesModel);

dashboardCollection.add(phSensorModel);
dashboardCollection.add(ecSensorModel);
// dashboardCollection.add(tdsSensorModel);
dashboardCollection.add(literSensorModel);
dashboardCollection.add(temperatureSensorModel);
//dashboardCollection.add(temperature0SensorModel);
//dashboardCollection.add(temperature1SensorModel);
dashboardCollection.add(switchesModel);
dashboardCollection.add(timedSwitchesModel);
//dashboardCollection.add(conductivitySensorModel);
//dashboardCollection.add(temperatureSensorModel);

qualityCollection.add(phSensorModel);
qualityCollection.add(ecSensorModel);
qualityCollection.add(tdsSensorModel);
// qualityCollection.add(salSensorModel);
qualityCollection.add(switchesModel);

temperatureCollection.add(temperature0SensorModel);
temperatureCollection.add(temperature1SensorModel);

switchesCollection.add(switchesModel);
switchesCollection.add(timedSwitchesModel);

distanceSensorModel.fetch();
literSensorModel.fetch();
phSensorModel.fetch();
ecSensorModel.fetch();
tdsSensorModel.fetch();
temperature0SensorModel.fetch();
temperature1SensorModel.fetch();
temperatureSensorModel.fetch();