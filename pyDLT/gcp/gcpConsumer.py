from confluent_kafka import Consumer
import sys
import time

conf = {
        'bootstrap.servers': "34.74.80.207:39092,131.247.3.206:9092",
        'group.id': "settledGroup1",
        'default.topic.config': {'auto.offset.reset': 'smallest'}}

consumer = Consumer(conf)
consumer.subscribe([sys.argv[1]])
print("Subscribed to %s" % sys.argv[1])

start = time.process_time()
counter = 0
try:
    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue
        
        counter += 1
        print("counter %d" % counter)
        print('Received message: {}'.format(msg.value().decode('utf-8')))


except KeyboardInterrupt:
    print(time.process_time() - start)
    print("Goodbye")
    consumer.close()
