import asyncio
from aredis import StrictRedis


async def setInitialState():
    client = StrictRedis(host='127.0.0.1',
                         port=6379,
                         db=0)
    await client.flushdb()
    await client.incr('transactionid', 1)
    user1dict = {
        "name": "A",
        "accNo": "000001",
        "routingNo": "000001",
        "balance": "100",
    }
    user1balance = {
        "name": user1dict["name"],
        "balance": user1dict["balance"]
    }
    user2dict = {
        "name": "B",
        "accNo": "000001",
        "routingNo": "000002",
        "balance": "100",
    }
    user2balance = {
        "name": user2dict["name"],
        "balance": user2dict["balance"]
    }
    await client.hmset(user1dict["routingNo"] + user1dict["accNo"],
                       user1balance)
    await client.hmset(user2dict["routingNo"] + user2dict["accNo"],
                       user2balance)


loop = asyncio.get_event_loop()
loop.run_until_complete(setInitialState())
