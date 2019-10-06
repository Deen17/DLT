import faust
from typing import List

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


@app.agent(initiated_topic)
async def process(transactions):
    async for transaction in transactions:
        # process infinite stream of orders.
        print(transaction)
