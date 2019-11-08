import faust
from typing import List
# import time
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
    settled: bool
    mutations: List[dict]


def user_to_dict(transaction: initiated):
    data = {
        'transactionID': transaction.transactionID,
        'senderAcctNum': transaction.senderAcctNum,
        'senderRoutingNum': transaction.senderRoutingNum,
        'receiverAcctNum': transaction.receiverAcctNum,
        'receiverRoutingNum': transaction.receiverRoutingNum,
        'currency': transaction.currency,
        'instrument': transaction.instrument,
        'initial_amt': transaction.initial_amt,
        'amt': transaction.amt,
        'mutations': transaction.mutations
    }
    return data


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

bankA_CA = app.topic('bankA_CA',
                     key_type=bytes,
                     value_type=initiated)

bankB_CA = app.topic('bankB_CA',
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
        take = transaction.amt * .5
        # message = "bankA_DA took %f of %f" % (take, transaction.amt)
        bankacc = "user:{}0000".format(transaction.senderRoutingNum)
        message = {bankacc: take}
        # await client.hincrbyfloat(bankacc,
        #                           "balance",
        #                           take)
        transaction.mutations.append(message)
        transaction.initial_amt -= take
        catopic = bank_switcher.get(int(transaction.receiverRoutingNum))
        catopic += "_CA"
        await app.topic(catopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankB_DA)
async def bankB_DA_process(transactions):
    """bankB's Debtor Agent takes 50% of a transaction's initial amount"""
    async for transaction in transactions:
        take = transaction.initial_amt * .5
        bankacc = "user:{}0000".format(transaction.senderRoutingNum)
        mutation = {bankacc: take}
        # await client.hincrbyfloat(bankacc,
        #                           "balance",
        #                           take)
        transaction.mutations.append(mutation)
        transaction.amt -= take
        catopic = bank_switcher.get(int(transaction.receiverRoutingNum))
        catopic += "_CA"
        await app.topic(catopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankA_CA)
async def bankA_CA_process(transactions):
    async for transaction in transactions:
        take = transaction.initial_amt * .5
        # message = "bankA_CA took %f of %f" % (take, transaction.initial_amt)
        bankacc = "user:{}0000".format(transaction.receiverRoutingNum)
        mutation = {bankacc: take}
        # await client.hincrbyfloat(bankacc,
        #                           "balance",
        #                           take)
        transaction.mutations.append(mutation)
        transaction.amt -= take
        await settled.send(value=transaction)


@app.agent(bankB_CA)
async def bankB_CA_process(transactions):
    async for transaction in transactions:
        take = transaction.initial_amt * .5
        # message = "bankB_CA took %f of %f" % (take, transaction.initial_amt)
        bankacc = "user:{}0000".format(transaction.receiverRoutingNum)
        mutation = {bankacc: take}
        # await client.hincrbyfloat(bankacc,
        #                           "balance",
        #                           take)
        transaction.mutations.append(mutation)
        transaction.amt -= take
        await settled.send(value=transaction)


@app.agent(settled)
async def process_settled(transactions):
    async for tx in transactions:
        async with await client.pipeline() as pipe:
            for mutation in tx.mutations:
                for key, value in mutation:
                    if key[0:5] == "user:":
                        bankacc = key[-8:]
                        await client.hincrbyfloat(bankacc,
                                                  "balance",
                                                  int(value))
                        continue
                    else:
                        pass
            tx.settled = True
            await pipe.hmset(user_to_dict(tx))  # convert tx to a dict
            res = await pipe.execute()
            print(res)


if __name__ == '__main__':
    app.main()
