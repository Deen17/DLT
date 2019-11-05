import faust
from typing import List
#import redis

r = redis.StrictRedis(host='localhost', port=6379,
                      password="", decode_responses=True)
# r.delete("gte", "lt")
app = faust.App('myapp1', broker='kafka://131.247.3.206:39092')


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
gte10k = app.topic('gte10k',
                   key_type=bytes,
                   value_type=initiated)
lt10k = app.topic('lt10k',
                  key_type=bytes,
                  value_type=initiated)

# settled = app.topic('settled_transactions',
#                   key_type=bytes,
#                   value_type=initiated)


@app.agent(initiated_topic)
async def process(transactions):
    lt = gte = 0
    async for transaction in transactions:
        # process infinite stream of orders.
        # print(transaction, transaction.amt)
        if transaction.amt >= 10000:
            gte = r.incr("gte")
            await gte10k.send(value=transaction)
            print("greater than: %d" % gte)
            if (gte % 200 == 0):
                print("gte: %d" % gte)
        else:
            lt = r.incr("lt")
            await lt10k.send(value=transaction)
            print("less than : %d" % lt)
            print("totall= %d" % sum)
            if (lt % 200 == 0):
                print("lt: %d" % lt)

if __name__ == '__main__':
    app.main()