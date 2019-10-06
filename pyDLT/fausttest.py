import faust
from  confluent_kafka.avro.serializer import message_serializer
#from confluent_kafka.avro.serializer import (ValueSerializerError, KeySerializerError, SerializerError)
app = faust.App('myapp1', broker='kafka://131.247.3.206.39092')



topic = app.topic()
# Models describe how messages are serialized:
# {"account_id": "3fae-...", amount": 3}
class Order(faust.Record):
    account_id: str
    amount: int

@app.agent(value_type=Order)
async def order(orders):
    async for order in orders:
        # process infinite stream of orders.
        print(f'Order for {order.account_id}: {order.amount}')


