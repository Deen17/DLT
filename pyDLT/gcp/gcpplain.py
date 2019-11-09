# how to run this
# go to directory local to this file, then run:
# faust -A gcpplain worker -l info --web-port 6067
import faust
from typing import List
# import time
from aredis import StrictRedis


bootstrap = 'kafka://34.74.80.207:39092;kafka://35.196.13.159:29092'
app = faust.App('myapp1',
                broker=bootstrap)
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
        # send this transaction to its appropriate sender's bank
        await app.topic(datopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankA_DA)
async def bankA_DA_process(transactions):
    """ The Sender's Bank can choose to take some percentage of the initial amount.
    This process then deducts that amount from the amount, then route the transaction
    to the Receiver's Bank"""
    async for transaction in transactions:
        take = transaction.initial_amt * .5
        bankacc = "user:{}0000".format(transaction.senderRoutingNum)
        message = {bankacc: take}
        transaction.mutations.append(message)
        transaction.amt -= take
        catopic = bank_switcher.get(int(transaction.receiverRoutingNum))
        catopic += "_CA"
        await app.topic(catopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankB_DA)
async def bankB_DA_process(transactions):
    """ The Sender's Bank can choose to take some percentage of the initial amount.
    This process then deducts that amount from the amount, then route the transaction
    to the Receiver's Bank"""
    async for transaction in transactions:
        take = transaction.initial_amt * .5
        bankacc = "user:{}0000".format(transaction.senderRoutingNum)
        mutation = {bankacc: take}
        transaction.mutations.append(mutation)
        transaction.amt -= take
        catopic = bank_switcher.get(int(transaction.receiverRoutingNum))
        catopic += "_CA"
        await app.topic(catopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankA_CA)
async def bankA_CA_process(transactions):
    """The Creditor Agent processes this transaction. Here, it has the chance
    to take some percentage of of the initial amount, as well. Just for fun."""
    async for transaction in transactions:
        take = transaction.initial_amt * .5
        bankacc = "user:{}0000".format(transaction.receiverRoutingNum)
        mutation = {bankacc: take}
        transaction.mutations.append(mutation)
        transaction.amt -= take
        await settled.send(value=transaction)


@app.agent(bankB_CA)
async def bankB_CA_process(transactions):
    """The Creditor Agent processes this transaction. Here, it has the chance
    to take some percentage of of the initial amount, as well. Just for fun."""
    async for transaction in transactions:
        take = transaction.initial_amt * .5
        bankacc = "user:{}0000".format(transaction.receiverRoutingNum)
        mutation = {bankacc: take}
        transaction.mutations.append(mutation)
        transaction.amt -= take
        await settled.send(value=transaction)


@app.agent(settled)
async def process_settled(transactions):
    """This function will cause all of the state changes to accounts."""
    async for tx in transactions:
        async with await client.pipeline() as pipe:
            for mutation in tx.mutations:
                for key, value in mutation.items():
                    if key[0:5] == "user:":
                        bankacc = key[-8:]
                        await pipe.hincrbyfloat(bankacc,
                                                "balance",
                                                int(value))
                        continue
                    else:
                        pass
            senderID = "user:{}{}".format(tx.senderRoutingNum,
                                          tx.senderAcctNum)
            receiverID = "user:{}{}".format(tx.receiverRoutingNum,
                                            tx.receiverAcctNum)
            take = float(tx.initial_amt) * -1
            give = float(tx.amt)
            # take the initial amount from the sender
            await pipe.hincrbyfloat(senderID,
                                    "balance",
                                    take)
            # give the final amount to the receiver
            await pipe.hincrbyfloat(receiverID,
                                    "balance",
                                    give)
            tx.settled = True
            transaction_name = "transactionID:{}".format(tx.transactionID)
            ready_transaction = "ready:{}".format(tx.transactionID)
            # set "transactionID:xxxxxxxx" to its final respective
            # dictionary state in Redis
            await pipe.hmset(transaction_name, user_to_dict(tx))
            # push to the ready queue for this transaction
            await pipe.rpush(ready_transaction, 0)
            # execute the entire transaction/pipeline
            res = await pipe.execute()
            print(res)


if __name__ == '__main__':
    app.main()
