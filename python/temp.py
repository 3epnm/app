import redis
import ow
import time

from rrdtool import update as rrd_update

ow.init('localhost:4304')

r = redis.StrictRedis(host="localhost", port=6379, db=0)

while True:
    sensorlist = ow.Sensor('/').sensorList()
    metric1 = 'U'
    metric2 = 'U'
    metric3 = 'U'
    metric4 = 'U'

    for sensor in sensorlist:
        r.publish(sensor.address, sensor.temperature)

        if sensor.address == '28FF8C56911501BD': 
            metric1 = sensor.temperature

        if sensor.address == '28FFE356911501C3': 
            metric2 = sensor.temperature
    
    r.publish('temperature', '{ "temp0": %s, "temp1": %s, "temp2": null, "temp3": null }' %(metric1, metric2))
    
    rrd_update('/home/pi/Development/data/temperature.rrd', 'N:%s:%s:%s:%s' %(metric1, metric2, metric3, metric4))
    
    time.sleep(5)
