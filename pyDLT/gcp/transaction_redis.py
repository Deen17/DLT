import asyncio
from aredis import StrictRedis, WatchError
from collections import deque

async def updateTransaction():
    client = StrictRedis(host='104.196.105.254',
                         port=6379,
                         db=0)
    # print(await client.zrange("test", 0, -1))
    tx_ids = []
    async with await client.pipeline() as pipe:
        for i in range(0, 10000):
           await pipe.incr('test')
        tx_ids = await pipe.execute()
    print("length of tx_ids:", len(tx_ids))
    




loop = asyncio.get_event_loop()
loop.run_until_complete(updateTransaction())
