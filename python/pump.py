import redis
import RPi.GPIO as GPIO
import json

import time
import atexit

from Adafruit_MotorHAT import Adafruit_MotorHAT, Adafruit_DCMotor

mh = Adafruit_MotorHAT(addr=0x60)

def turnOffMotors():
    mh.getMotor(1).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(2).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(3).run(Adafruit_MotorHAT.RELEASE)
    mh.getMotor(4).run(Adafruit_MotorHAT.RELEASE)

turnOffMotors()

atexit.register(turnOffMotors)

MOTOR_CHANNELS = {
    "A" : 1, 
    "B" : 2,
    "C" : 3,
    "D" : 4
}

rs = redis.StrictRedis(host="localhost", port=6379, db=0)

def low(channel):
    message = '{ "gpio": "%s", "state": "low" }' % channel

    rs.set('timedgpio:state:%s' % channel, message)
    rs.publish('timedgpio:state', message)

    motor = mh.getMotor(MOTOR_CHANNELS[channel])
    motor.run(Adafruit_MotorHAT.RELEASE)

def high(channel, speed, timeout):
    message = '{ "gpio": "%s", "state": "high", "speed": "%s", "timeout": "%s" }' % (channel, speed, timeout)
    
    motor = mh.getMotor(MOTOR_CHANNELS[channel])
    motor.setSpeed(int(speed))

    motor.run(Adafruit_MotorHAT.FORWARD);

    rs.set('timedgpio:state:%s' % channel, message)
    rs.publish('timedgpio:state', message)

    time.sleep(float(timeout))

    motor.run(Adafruit_MotorHAT.RELEASE)
    
    low(channel=channel)

try:    
    r = redis.StrictRedis(host="localhost", port=6379, db=0)
    p = r.pubsub()
    p.subscribe('timedgpio:set')
    
    while True:
        message = p.get_message()
        if message:
            if message["type"] == "message" and message["channel"] == "timedgpio:set":
                data = json.loads(message['data'])
                if data["state"] == 'high':
                    high(channel=data["gpio"], speed=data["speed"], timeout=data["timeout"])
                if data["state"] == 'low':
                    low(channel=data["gpio"])
        time.sleep(0.001)

except KeyboardInterrupt:
    print ''
    print 'pump is ending'
