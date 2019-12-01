# how to run this
# go to directory local to this file, then run:
# faust -A workerPiped worker -l info --web-port 6067
import faust
from typing import List
# import time
from aredis import StrictRedis
from collections import deque

finished_deque = deque()
bootstrap = 'kafka://34.74.80.207:39092;kafka://35.196.13.159:29092;kafka://34.74.86.119:19092'  # noqa
app = faust.App('myapp1',
                broker=bootstrap,
                processing_guarantee='exactly_once')
client = StrictRedis(
    # host='127.0.0.1',
    host='104.196.105.254',
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


def to_dict(transaction: initiated):
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
        'settled': transaction.settled,
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

delayed_transactions = app.topic(
    'delayed_transactions',
    key_type=bytes,
    value_type=initiated)


@app.agent(initiated_topic)
async def process(transactions):
    """Initial processing of all processes. Routes transactions to the
    appropriate place"""
    async for transaction in transactions:
        datopic = bank_switcher.get(int(transaction.senderRoutingNum)) + "_DA"
        # send this transaction to its appropriate sender's bank
        await app.topic(datopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(delayed_transactions)
async def sendFromDelayedToCA(transactions):
    """Reroutes messages after getting passed the delayed phase to the appropriate
    Creditor Agent."""
    async for transaction in transactions:
        catopic = bank_switcher.get(int(transaction.receiverRoutingNum))
        catopic += "_CA"
        await app.topic(catopic,
                        key_type=bytes,
                        value_type=initiated).send(value=transaction)


@app.agent(bankA_DA)
async def bankA_DA_process(transactions):
    """ The Sender's Bank can choose to take some percentage of the initial amount.
    This process then deducts that amount from the amount,
    then route the transaction to the Receiver's Bank"""
    async for transaction in transactions:
        # print(transaction.settled)
        if transaction.initial_amt >= 10000 and settled is False:
            print(transaction)
            async with await client.pipeline() as pipe:
                delayedtx = "delayedtx:{}".format(transaction.transactionID)
                await pipe.hmset(
                    delayedtx,
                    to_dict(transaction))
                bankdelays = 'bankdelays:{}'.format(
                    transaction.senderRoutingNum)
                await pipe.zadd(
                    bankdelays,
                    transaction.transactionID,
                    transaction.transactionID)
                await pipe.rpush('readydelayed:{}'.format(transaction.transactionID), 1) # noqa
                res = await pipe.execute() # noqa
        else:
            take = transaction.initial_amt * .05
            bankacc = "user:{}0000".format(transaction.senderRoutingNum)
            message = {bankacc: take}
            transaction.mutations.append(message)
            transaction.amt -= take
            catopic = bank_switcher.get(int(transaction.receiverRoutingNum))
            catopic += "_CA"
            # print("DA->CA")
            # await app.commit("bankA_DA")
            await app.topic(catopic,
                            key_type=bytes,
                            value_type=initiated).send(value=transaction)


@app.agent(bankB_DA)
async def bankB_DA_process(transactions):
    """ The Sender's Bank can choose to take some percentage of the initial amount.
    This process then deducts that amount from the amount,
    then route the transaction to the Receiver's Bank"""
    async for transaction in transactions:
        if transaction.initial_amt >= 10000:
            async with await client.pipeline() as pipe:
                delayedtx = "delayedtx:{}".format(transaction.transactionID)
                await pipe.hmset(
                    delayedtx,
                    to_dict(transaction))
                bankdelays = 'bankdelays:{}'.format(
                    transaction.senderRoutingNum)
                await pipe.zadd(
                    bankdelays,
                    transaction.transactionID,
                    transaction.transactionID)
                await pipe.rpush('readydelayed:{}'.format(transaction.transactionID), 1) # noqa
                res = await pipe.execute()  # noqa
        else:
            take = transaction.initial_amt * .1
            bankacc = "user:{}0000".format(transaction.senderRoutingNum)
            mutation = {bankacc: take}
            transaction.mutations.append(mutation)
            transaction.amt -= take
            catopic = bank_switcher.get(int(transaction.receiverRoutingNum))
            catopic += "_CA"
            # print("DA->CA")
            # await app.commit("bankB_DA")
            await app.topic(catopic,
                            key_type=bytes,
                            value_type=initiated).send(value=transaction)


@app.agent(bankA_CA)
async def bankA_CA_process(transactions):
    """The Creditor Agent processes this transaction. Here, it has the chance
    to take some percentage of of the initial amount, as well. Just for fun."""
    async for transaction in transactions:
        take = transaction.initial_amt * .05
        bankacc = "user:{}0000".format(transaction.receiverRoutingNum)
        mutation = {bankacc: take}
        transaction.mutations.append(mutation)
        transaction.amt -= take
        # print("CA->settled")
        # await app.commit("bankA_CA")
        await settled.send(value=transaction)


@app.agent(bankB_CA)
async def bankB_CA_process(transactions):
    """The Creditor Agent processes this transaction. Here, it has the chance
    to take some percentage of of the initial amount, as well. Just for fun."""
    async for transaction in transactions:
        take = transaction.initial_amt * .1
        bankacc = "user:{}0000".format(transaction.receiverRoutingNum)
        mutation = {bankacc: take}
        transaction.mutations.append(mutation)
        transaction.amt -= take
        # print("ca->settled")
        # await app.commit("bankB_CA")
        await settled.send(value=transaction)


@app.agent(settled)
async def process_settled(transactions):
    """This function will cause all of the state changes to accounts."""
    async for tx in transactions:
        finished_deque.append(tx)


@app.timer(interval=1.5)
async def every_second():
    """Every second, this worker pops at most 300 transactions from the
    deque of settled transactions ready to be committed to Redis, then
    sends all of these transactions together, atomically."""
    async with await client.pipeline() as pipe:
        while finished_deque:
            tx = finished_deque.popleft()
            for mutation in tx.mutations:
                for key, value in mutation.items():
                    if key[0:5] == "user:":
                        bankacc = key[-8:]
                        await pipe.hincrbyfloat(key,
                                                "balance",
                                                int(value))
                        # add transaction to set of transactions under bank
                        # user account
                        transaction_set = "transactions:{}".format(bankacc)
                        await pipe.zadd(
                            transaction_set,
                            tx.transactionID,
                            tx.transactionID)
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
            await pipe.hmset(transaction_name, to_dict(tx))
            sender_set = "transactions:{}{}".format(tx.senderRoutingNum,
                                                    tx.senderAcctNum)
            receiver_set = "transactions:{}{}".format(tx.receiverRoutingNum,
                                                      tx.receiverAcctNum)
            for user_set in [sender_set, receiver_set]:
                await pipe.zadd(
                    user_set,
                    tx.transactionID,
                    tx.transactionID
                )
            # push to the ready queue for this transaction
            await pipe.rpush(ready_transaction, 0)
            # execute the entire pipeline
        res = await pipe.execute()  # noqa
        # print(res)

if __name__ == '__main__':
    app.main()
