from confluent_kafka import Producer
import random
conf = {
    'bootstrap.servers' : '131.246.3.206:9092',
    'client.id' : 'test_notlocal',
}

producer = Producer(conf)
print(producer.list_topics(topic='transactions'))