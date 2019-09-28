from confluent_kafka import Producer
import random
import time
conf = {
    'bootstrap.servers' : 'localhost:9092',
    'client.id' : 'test_notlocal',
}

producer = Producer(conf)
print(producer.list_topics())
x = random.randint(1,1000)

def on_callback(err, msg):
    if err:
        print(err)
    else:
        print(msg)

ts = time.time()
producer.produce('transactions', key='1', value=f'${ts}: ${x}', on_delivery=on_callback)
producer.flush()
print(x)
