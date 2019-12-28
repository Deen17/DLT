import asyncio
from aredis import StrictRedis
import json

with open('config.json') as config_file:
    configs = json.load(config_file)

async def updateTransaction():
    client = StrictRedis(host=configs['redis_ip'],
                         port=6379,
                         db=0)
    # print(await client.zrange("test", 0, -1))
    tx_ids = []
    async with await client.pipeline() as pipe:
        for i in range(0, 10000):
            await pipe.incr('test')
        await pipe.delete('test')
        tx_ids = await pipe.execute()
    print("length of tx_ids:", len(tx_ids))


loop = asyncio.get_event_loop()
loop.run_until_complete(updateTransaction())
