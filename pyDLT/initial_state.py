import asyncio
from aredis import StrictRedis


async def setInitialState():
    client = StrictRedis(
        # host='127.0.0.1',
        host='104.196.105.254',
        port=6379,
        db=0)
    await client.flushdb()
    # user A is a customer of bank A
    user1dict = {
        "name": "adil",
        "accNo": "0001",
        "routingNo": "0001",
        "balance": 0,
    }
    user1balance = {
        "name": user1dict["name"],
        "balance": user1dict["balance"],
        "password": "jpmdlt"
    }
    # user B is a customer of bank B
    user2dict = {
        "name": "boyang",
        "accNo": "0001",
        "routingNo": "0002",
        "balance": 0,
    }
    user2balance = {
        "name": user2dict["name"],
        "balance": user2dict["balance"],
        "password": "jpmdlt"
    }
    bankAbalance = {
        "name": "bankA",
        "balance": 0,
        "password": "jpmdlt"
    }
    bankBbalance = {
        "name": "bankB",
        "balance": 0,
        "password": "jpmdlt"
    }
    usernames = {
        "adil": "00010001",
        "boyang": "00020001",
        "sabreen": "00020002",
        "bankA": "00010000",
        "bankB": "00020000"
    }
    user3dict = {
        "name": "sabreen",
        "accNo": "0002",
        "routingNo": "0002",
        "balance": 0,
    }
    user3balance = {
        "name": user3dict["name"],
        "balance": user3dict["balance"],
        "password": "jpmdlt"
    }
    # await client.incr('transaction')
    await client.hmset("user:" + user1dict["routingNo"] + user1dict["accNo"],
                       user1balance)
    await client.hmset("user:" + user2dict["routingNo"] + user2dict["accNo"],
                       user2balance)

    await client.hmset("user:" + user3dict["routingNo"] + user3dict["accNo"],
                       user3balance)

    await client.hmset("user:" + "00010000",
                       bankAbalance)
    await client.hmset("user:" + "00020000",
                       bankBbalance)
    await client.hmset("usernames", usernames)
    await client.zadd("bank:" + "0001", "0001", "0001")
    await client.zadd("bank:" + "0002", "0001", "0001")

loop = asyncio.get_event_loop()
loop.run_until_complete(setInitialState())
