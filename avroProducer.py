from confluent_kafka import avro
from confluent_kafka.avro import AvroProducer
key_schema_str = """
{
   "namespace": "transaction.test",
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
   "namespace": "transaction.test",
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
     }
   ]
}
"""

value_schema = avro.loads(value_schema_str)
key_schema = avro.loads(key_schema_str)

key = {
    "transactionID": 0
}

value = {
    "transactionID": 0,
    "senderAcctNum": 161,
    "receiverAcctNum": 420,
    "senderRoutingNum": 15453525,
    "receiverRoutingNum": 44444444,
    "currency": "USD",
    "amt": 100
}

avroProducer = AvroProducer({
    'bootstrap.servers': 'localhost:9092',
    'client.id': 'avrotest',
    'schema.registry.url': 'http://localhost:8081'
}, default_key_schema=key_schema, default_value_schema=value_schema)

avroProducer.produce(topic='transactions', value=value, key=key)
avroProducer.flush()