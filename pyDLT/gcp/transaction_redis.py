import asyncio
from aredis import StrictRedis, WatchError


async def updateTransaction():
    client = StrictRedis(host='127.0.0.1',
                         port=6379,
                         db=0)
    # print(await client.zrange("test", 0, -1))
    async with await client.pipeline() as pipe:
        while 1:
            try:
                # await pipe.watch('test')
                client.hincrbyfloat()
                client.hms
            except WatchError:
                continue
    

loop = asyncio.get_event_loop()
loop.run_until_complete(updateTransaction())
