from schema_registry.client import SchemaRegistryClient, schema
from schema_registry.serializers import FaustSerializer


client = SchemaRegistryClient(url='http://131.247.3.206:8081')

init_trans_schema = schema.AvroSchema({
    "namespace": "initialtransaction.test",
    "name": "value",
    "type": "record",
    "fields": [
        {
            "name": "transactionID",
            "type": "int"
        },
        {
            "name": "senderAcctNum",
            "type": "int"
        },
        {
            "name": "receiverAcctNum",
            "type": "int"
        },
        {
            "name": "senderRoutingNum",
            "type": "int"
        },
        {
            "name": "receiverRoutingNum",
            "type": "int"
        },
        {
            "name": "currency",
            "type": "string"
        },
        {
            "name": "amt",
            "type": "int"
        },
        {
            "name": "mutations",
            "type": "array",
            "items": "string"
        }
    ]
})

init_trans_ser = FaustSerializer(client, init_trans_schema)


def avro_initial_transactions_codec():
    return init_trans_ser
