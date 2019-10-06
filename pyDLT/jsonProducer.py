from confluent_kafka import Producer
import json
import random

conf = {
    'bootstrap.servers': '131.247.3.206:39092',
    'client.id': 'jsonProducer1',
}

producer = Producer(conf)

x = random.randint(1, 1000)

value = {
    "transactionID": "000000000000",
    "senderAcctNum": "161",
    "receiverAcctNum": "420",
    "senderRoutingNum": "15453525",
    "receiverRoutingNum": "44444444",
    "currency": "USD",
    "amt": x,
    "mutations": []
}

b = json.dumps(value).encode('utf-8')
# value2 = json.loads(b.decode('utf-8'))


def on_callback(err, msg):
    if err:
        print(err)
    else:
        print(msg)


producer.produce('initiated_transactions', key='1'.encode('utf-8'),
                 value=b, on_delivery=on_callback)
producer.flush()
