from confluent_kafka import Consumer

conf = {'bootstrap.servers': "131.247.3.206:39092",
        'group.id': "adilDesktop",
        'default.topic.config': {'auto.offset.reset': 'smallest'}}

consumer = Consumer(conf)
consumer.subscribe(['initiated_transactions'])

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
