import faust
from typing import List
import time
import redis

# faust -A gcpplain worker -l info --web-port 6067
r = redis.StrictRedis(host='localhost', port=6379,
                      password="", decode_responses=True)
# r.delete("gte", "lt")
app = faust.App('myapp1',
                broker='kafka://34.74.80.207:39092;kafka://131.247.3.206:9092')


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


x = List[str]

initiated_topic = app.topic('initiated_transactions',
                            key_type=bytes,
                            value_type=initiated)
# gte10k = app.topic('gte10k',
#                    key_type=bytes,
#                    value_type=initiated)
# lt10k = app.topic('lt10k',
#                   key_type=bytes,
#                   value_type=initiated)

settled = app.topic('settled_transactions',
                    key_type=bytes,
                    value_type=initiated)

over10k = []

debtor_agent = app.channel()  # in-memory buffer


@app.agent(initiated_topic)
async def process(transactions):
    async for transaction in transactions:
        if transaction.amt >= 10000:
            over10k.append([time.time(), transaction])
            await debtor_agent.send(value=transaction)
        else:
            await debtor_agent.send(value=transaction)
            # await lt10k.send(value=transaction)


@app.agent(debtor_agent)
async def discount(transactions):
    async for transaction in transactions:
        take = transaction.amt * .1
        message = "DA took %f of %f" % (take, transaction.amt)
        transaction.mutations.append(message)
        transaction.amt -= take
        await settled.send(value=transaction)


# @app.timer(interval=1)
# async def check10Queue():
#     if(len(over10k) > 0):
#         for i in range(len(over10k)):
#             if(over10k[i][0] + 10 < time.time()):
#                 await debtor_agent.send(value=over10k.pop(i)[1])
#     # if len(over10k) > 0:
#     #     if over10k[0][0] + 10 < time.time():
#     #         await debtor_agent.send(value=over10k.pop(0)[1])
#     #         # await settled.send(value=over10k.pop(0)[1])


@app.agent(settled)
async def print_finalized(transactions):
    async for tx in transactions:
        print(time.time())
        # if(r.incr('total') % 200 == 0):
        print(tx)

if __name__ == '__main__':
    app.main()
