import redis
import RPi.GPIO as GPIO
import time
from rrdtool import update as rrd_update
from numpy import median
import atexit
import traceback
import multiprocessing

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False) 

GPIO_TRIGGER = 23
GPIO_ECHO = 24
 
GPIO.setup(GPIO_TRIGGER, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)
 
def distance():
   GPIO.output(GPIO_TRIGGER, True)
   time.sleep(0.00001)
   GPIO.output(GPIO_TRIGGER, False)

   StartZeit = time.time()
   StopZeit = time.time()

   while GPIO.input(GPIO_ECHO) == 0:
      StartZeit = time.time()

   while GPIO.input(GPIO_ECHO) == 1:
      StopZeit = time.time()

   pulse_duration = StopZeit - StartZeit

   distance = pulse_duration * 17150 
   distance = round(distance, 2)  

   return distance

r = redis.StrictRedis(host="localhost", port=6379, db=0)

def readDistance():
   a = distance()
   time.sleep(0.1)
   b = distance()
   time.sleep(0.1)
   c = distance()
   time.sleep(0.1)
   d = distance()
   time.sleep(0.1)
   e = distance()

   value = median([a, b, c, d, e])

   r.publish('distance', value)

   rrd_update('/home/pi/Development/data/distance.rrd', 'N:%s' % value)

   print("%s, %s cm" % (time.strftime("%Y-%m-%d %H:%M:%S"), value))

   GPIO.output(GPIO_TRIGGER, False)        
   time.sleep(1.5)

def exit_handler():
   print 'exit'
   GPIO.cleanup()

atexit.register(exit_handler)

try:  
   while True:
      readDistance()

except KeyboardInterrupt:
   traceback.print_exc()
   print ''
   print 'dist is ending'

except:
   traceback.print_exc()
   print 'error'
