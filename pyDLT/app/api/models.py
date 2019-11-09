from aredis import StrictRedis
# import asyncio

r = StrictRedis(host='127.0.0.1',
                     port=6379,
                     db=0)

value = {
    "senderAcctNum": "0001",
    "receiverAcctNum": "0001",
    "senderRoutingNum": "0001",
    "receiverRoutingNum": "0002",
    "currency": "USD",
    "amt": 100,
    "instrument": "credit",
}


class User():

    def __init__(self):
        self.mutations = []

    @classmethod
    async def create(cls,
                     currency,
                     instrument,
                     senderAcctNum,
                     receiverAcctNum,
                     senderRoutingNum,
                     receiverRoutingNum,
                     amt):
        self = User()
        tid = await r.incr('transaction')
        self.transactionID = ("{}".format(tid)).zfill(7)
        self.senderAcctNum = senderAcctNum
        self.senderRoutingNum = senderRoutingNum
        self.receiverAcctNum = receiverAcctNum
        self.receiverRoutingNum = receiverRoutingNum
        self.currency = 'USD' if None else currency
        self.instrument = 'cash' if None else instrument
        self.initial_amt = amt
        self.amt = amt
        return self

    def to_dict(self):
        data = {
            'transactionID': self.transactionID,
            'senderAcctNum': self.senderAcctNum,
            'senderRoutingNum': self.senderRoutingNum,
            'receiverAcctNum': self.receiverAcctNum,
            'receiverRoutingNum': self.receiverRoutingNum,
            'currency': self.currency,
            'instrument': self.instrument,
            'initial_amt': self.initial_amt,
            'amt': self.amt,
            'mutations': []
        }
        return data

    def __repr__(self):
        # string = ''
        # for key, value in self.to_dict().items():
        #     str += "{}: {}\n".format(key, value)
        # return str
        return repr(self.to_dict())


# async def main():
#     foo = await User.create(**value)
#     print(foo)

# loop = asyncio.get_event_loop()
# loop.run_until_complete(main())
