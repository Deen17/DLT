import asyncio
from aredis import StrictRedis
from collections import deque
from confluent_kafka import Producer
import time
import json

with open('config.json') as config_file:
    configs = json.load(config_file)

start_time = 0
conf = {
    'bootstrap.servers': configs['bootstrap'],
    'client.id': 'test1',
}

producer = Producer(conf)


def on_callback(err, msg):
    if err:
        print(err)
    # else:
    #     print(msg)


async def updateTransaction():
    value = {
        "transactionID": "",
        "senderAcctNum": "0001",
        "receiverAcctNum": "0001",
        "senderRoutingNum": "0001",
        "receiverRoutingNum": "0002",
        "currency": "USD",
        "initial_amt": 100,
        "amt": 100,
        "instrument": "credit",
        "settled": False,
        "mutations": []
    }
    client = StrictRedis(host=configs['redis_ip'],
                         port=6379,
                         db=0)
    # print(await client.zrange("test", 0, -1))
    tx_ids = deque()
    async with await client.pipeline() as pipe:
        for i in range(0, 30000):
            await pipe.incr('transaction')
        tx_ids = deque(await pipe.execute())
    print("length of tx_ids:", len(tx_ids))
    count = 0
    for i in tx_ids:
        value['transactionID'] = i
        b = json.dumps(value).encode('utf-8')
        producer.produce('initiated_transactions',
                         key=None,
                         value=b,
                         on_delivery=on_callback)
        if(i % 100000 == 0):
            producer.flush()
        count = count + 1
    producer.flush()
    total_time = time.time() - start_time
    print(total_time)


loop = asyncio.get_event_loop()
start_time = time.time()
loop.run_until_complete(updateTransaction())
