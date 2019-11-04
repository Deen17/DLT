import asyncio
from aredis import StrictRedis


async def setInitialState():
    client = StrictRedis(host='127.0.0.1',
                         port=6379,
                         db=0)
    await client.flushdb()
    # user A is a customer of bank A
    user1dict = {
        "name": "A",
        "accNo": "0001",
        "routingNo": "0001",
        "balance": 10000,
    }
    user1balance = {
        "name": user1dict["name"],
        "balance": user1dict["balance"]
    }
    # user B is a customer of bank B
    user2dict = {
        "name": "B",
        "accNo": "0001",
        "routingNo": "0002",
        "balance": 10000,
    }
    user2balance = {
        "name": user2dict["name"],
        "balance": user2dict["balance"]
    }
    bankAbalance = {
        "name": "bankA",
        "balance": 0
    }
    bankBbalance = {
        "name": "bankB",
        "balance": 0
    }
    # await client.incr('transaction')
    await client.hmset("user:" + user1dict["routingNo"] + user1dict["accNo"],
                       user1balance)
    await client.hmset("user:" + user2dict["routingNo"] + user2dict["accNo"],
                       user2balance)
    await client.hmset("user:" + "00010000",
                       bankAbalance)
    await client.hmset("user:" + "00020000",
                       bankBbalance)
    await client.zadd("bank:" + "0001", "0001", "0001")
    await client.zadd("bank:" + "0002", "0001", "0001")

loop = asyncio.get_event_loop()
loop.run_until_complete(setInitialState())
