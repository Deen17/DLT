from confluent_kafka import avro
from confluent_kafka.avro import AvroProducer
import random
key_schema_str = """
{
   "namespace": "initialtransaction.test",
   "name": "key",
   "type": "record",
   "fields" : [
     {
       "name" : "transactionID",
       "type" : "int"
     }
   ]
}
"""

value_schema_str = """
{
   "namespace": "initialtransaction.test",
   "name": "value",
   "type": "record",
   "fields" : [
     {
       "name" : "transactionID",
       "type" : "int"
     },
     {
       "name" : "senderAcctNum",
       "type" : "int"
     },
     {
       "name" : "receiverAcctNum",
       "type" : "int"
     },
     {
       "name" : "senderRoutingNum",
       "type" : "int"
     },
     {
       "name" : "receiverRoutingNum",
       "type" : "int"
     },
     {
       "name" : "currency",
       "type" : "string"
     },
     {
       "name" : "amt",
       "type" : "int"
     },
     {
       "name" : "mutations",
       "type" : "array",
       "items" : "string"
     }
   ]
}
"""

value_schema = avro.loads(value_schema_str)
key_schema = avro.loads(key_schema_str)

key = {
    "transactionID": 0
}

x = random.randint(1, 1000)

value = {
    "transactionID": 0,
    "senderAcctNum": 161,
    "receiverAcctNum": 420,
    "senderRoutingNum": 15453525,
    "receiverRoutingNum": 44444444,
    "currency": "USD",
    "amt": x
}

avroProducer = AvroProducer({
    'bootstrap.servers': '131.247.3.206:9092',
    'client.id': 'avrotest',
    'schema.registry.url': 'http://131.247.3.206:8081'
}, default_key_schema=key_schema, default_value_schema=value_schema)

avroProducer.produce(topic='transactions', value=value, key=key)
avroProducer.flush()
