from confluent_kafka import Producer
import json
import random
import asyncio
import time

conf = {
    'bootstrap.servers': '34.74.80.207:39092,131.247.3.206:9092',
    'client.id': 'jsonProducer1',
}

producer = Producer(conf)

x = random.randint(9940, 10010)

value = {
    "transactionID": "000000000000",
    "senderAcctNum": "161",
    "receiverAcctNum": "420",
    "senderRoutingNum": "15453525",
    "receiverRoutingNum": "44444444",
    "currency": "USD",
    "amt": 9000,
    "mutations": []
}

b = json.dumps(value).encode('utf-8')
# value2 = json.loads(b.decode('utf-8'))


def on_callback(err, msg):
    if err:
        print(err)
    else:
        print(msg)


start = time.process_time_ns()


async def main():
    for i in range(0, 20000):
        x = random.randint(0, 10010)

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
        producer.produce('initiated_transactions',
                         # key='1'.encode('utf-8'),
                         key=None,
                         value=b,
                         on_delivery=on_callback)
    producer.flush()
    print("%f seconds" % ((time.process_time_ns() - start) / 1000000000))


asyncio.run(main())
