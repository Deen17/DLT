import asyncio
from aredis import StrictRedis


async def setInitialState():
    client = StrictRedis(host='127.0.0.1',
                         port=6379,
                         db=0)
    await client.flushdb()
    await client.incr('userid', 1)
    user1dict = {
        "name": "A",
        "accNo": "000001",
        "routingNo": "000001",
        "balance": "100",
    }
    user2dict = {
        "name": "B",
        "accNo": "000001",
        "routingNo": "000002",
        "balance": "100",
    }
    await client.hmset()


loop = asyncio.get_event_loop()
loop.run_until_complete(setInitialState())
