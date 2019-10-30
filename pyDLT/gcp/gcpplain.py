import faust
from typing import List
import time
# import redis

# faust -A gcpplain worker -l info --web-port 6067 --debug
# r = redis.StrictRedis(host='localhost', port=6379,
#                       password="", decode_responses=True)
# r.delete("gte", "lt")
app = faust.App('myapp1',
                broker='kafka://34.74.80.207:39092')


# Models describe how messages are serialized:
# {"account_id": "3fae-...", amount": 3}
class initiated(faust.Record, serializer='json'):
    transactionID: int
    senderAcctNum: str
    receiverAcctNum: str
    senderRoutingNum: str
    receiverRoutingNum: str
    currency: str
    amt: float
    mutations: List[str]


initiated_topic = app.topic('initiated_transactions',
                            key_type=bytes,
                            value_type=initiated)
# gte10k = app.topic('gte10k',
#                    key_type=bytes,
#                    value_type=initiated)
lt10k = app.topic('lt10k',
                  key_type=bytes,
                  value_type=initiated)

# settled = app.topic('settled_transactions',
#                   key_type=bytes,
#                   value_type=initiated)

over10k = []


@app.agent(initiated_topic)
async def process(transactions):
    async for transaction in transactions:
        if transaction.amt >= 10000:
            over10k.append([time.time(), transaction])
        else:
            pass
            # await lt10k.send(value=transaction)


@app.timer(interval=1)
async def check10Queue():
    if len(over10k) > 0:
        print(over10k[0])
        if over10k[0][0] + 10 < time.time():
            over10k.pop(0)


if __name__ == '__main__':
    app.main()
