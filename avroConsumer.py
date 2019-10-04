from confluent_kafka import KafkaError
from confluent_kafka.avro import AvroConsumer
from confluent_kafka.avro.serializer import SerializerError

consumer = AvroConsumer({
    'bootstrap.servers': '131.247.3.206:39092',
    'group.id': 'bar',
    'schema.registry.url': 'http://131.247.3.206:8081'
})
consumer.subscribe(['transactions'])
try:
    while True:
        try:
            msg = consumer.poll(10)

        except SerializerError as e:
            #print(" Message deserialization failed for {}: }{}".format(msg,e))
            break
            
        if msg is None:
            continue

        if msg.error():
            print("AvroConsumer error: {}".format(msg.error()))
            continue

        print(msg.value())
except KeyboardInterrupt:
    print('interrupted')
    consumer.close()