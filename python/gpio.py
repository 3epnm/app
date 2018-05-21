import redis
import RPi.GPIO as GPIO
import time
import json
import atexit

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

GPIO_CHANNELS = {
    "A" : 12, 
    "B" : 16,
    "C" : 20,
    "D" : 21,
    "E" : 6,
    "F" : 13,
    "G" : 19,
    "H" : 26,
}

for pin in GPIO_CHANNELS.itervalues():
	GPIO.setup(pin, GPIO.OUT)

rs = redis.StrictRedis(host="localhost", port=6379, db=0)

def high(channel):
    GPIO.output(GPIO_CHANNELS[channel], True)
    message = '{ "gpio": "%s", "state": "high" }' % channel
    
    rs.set('gpio:state:%s' % channel, message)
    rs.publish('gpio:state', message)

def low(channel):
    GPIO.output(GPIO_CHANNELS[channel], False)
    message = '{ "gpio": "%s", "state": "low" }' % channel

    rs.set('gpio:state:%s' % channel, message)
    rs.publish('gpio:state', message)

for channel in GPIO_CHANNELS.iterkeys():
    low(channel=channel)

def exit_handler():
    GPIO.cleanup()

atexit.register(exit_handler)

try:    
    r = redis.StrictRedis(host="localhost", port=6379, db=0)
    p = r.pubsub()
    p.subscribe('gpio:set')
    
    while True:
        message = p.get_message()
        if message:
            if message["type"] == "message" and message["channel"] == "gpio:set":
                data = json.loads(message['data'])
                if data["state"] == 'high':
                    high(channel=data["gpio"])
                if data["state"] == 'low':
                    low(channel=data["gpio"])
        time.sleep(0.001)

except KeyboardInterrupt:
    print ''
    print 'gpio is ending'
