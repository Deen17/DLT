import faust
from typing import List
import time
from aredis import StrictRedis

# faust -A gcpplain worker -l info --web-port 6067
# r = redis.StrictRedis(host='localhost', port=6379,
#                       password="", decode_responses=True)
# r.delete("gte", "lt")
app = faust.App('myapp1',
                broker='kafka://34.74.80.207:39092;kafka://131.247.3.206:9092')
client = StrictRedis(host='127.0.0.1',
                     port=6379,
                     db=0)


# Models describe how messages are serialized:
# {"account_id": "3fae-...", amount": 3}
class initiated(faust.Record, serializer='json'):
    transactionID: int
    senderAcctNum: str
    receiverAcctNum: str
    senderRoutingNum: str
    receiverRoutingNum: str
    currency: str
    initial_amt: float
    amt: float
    instrument: str
    mutations: List[str]


bank_switcher = {
    1: "bankA",
    2: "bankB"
}

initiated_topic = app.topic('initiated_transactions',
                            key_type=bytes,
                            value_type=initiated)

settled = app.topic('settled_transactions',
                    key_type=bytes,
                    value_type=initiated)

bankA_DA = app.topic('bankA_DA',
                     key_type=bytes,
                     value_type=initiated)

bankB_DA = app.topic('bankB_DA',
                     key_type=bytes,
                     value_type=initiated)

over10k = []


debtor_agent = app.channel()  # in-memory buffer


@app.agent(initiated_topic)
async def process(transactions):
    async for transaction in transactions:
        datopic = bank_switcher.get(int(transaction.senderRoutingNum)) + "_DA"
        await app.topic(datopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankA_DA)
async def bankA_DA_process(transactions):
    async for transaction in transactions:
        take = transaction.amt * .1
        message = "bankA_DA took %f of %f" % (take, transaction.amt)
        bankacc = "user:{}0000".format(transaction.receiverRoutingNum)
        await client.hincrbyfloat(bankacc,
                                  "balance",
                                  take)
        transaction.mutations.append(message)
        transaction.amt -= take
        catopic = bank_switcher.get(int(transaction.senderRoutingNum)) + "_CA"
        await app.topic(catopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankB_DA)
async def bankB_DA_process(transactions):
    async for transaction in transactions:
        take = transaction.amt * .1
        message = "bankB_DA took %f of %f" % (take, transaction.amt)
        transaction.mutations.append(message)
        transaction.amt -= take
        catopic = bank_switcher.get(int(transaction.senderRoutingNum)) + "_CA"
        await app.topic(catopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


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
