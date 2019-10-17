from confluent_kafka import Consumer
import sys

conf = {'bootstrap.servers': "131.247.3.206:9092",
        'group.id': "settledGroup1",
        'default.topic.config': {'auto.offset.reset': 'smallest'}}

consumer = Consumer(conf)
consumer.subscribe([sys.argv[1]])
print("Subscribed to %s" % sys.argv[1])

try:
    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue
        if msg.error():
            print("Consumer error: {}".format(msg.error()))
            continue

        print('Received message: {}'.format(msg.value().decode('utf-8')))


except KeyboardInterrupt:
    print("Goodbye")
    consumer.close()
