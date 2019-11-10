import asyncio
from quart import Quart
from aredis import StrictRedis
import json

app = Quart(__name__)
r = StrictRedis(
    host='127.0.0.1',
    port=6379,
    db=0,
    decode_responses=True
)

@app.route('/')
async def hello():
    await asyncio.sleep(1)
    return 'hello'

@app.route('/users/<string:id>', methods=['GET'])
async def get_user_details_by_userid(id):
    x = await r.hgetall("user:{}".format(id))
    return x


@app.route('/users/<int:id>/transactions', methods=['GET'])
async def get_user_transaction_list_by_userid(id):
    pass


@app.route('/users/transaction/<int:id>', methods=['POST'])
async def post_transaction():
    """the request object contains a transaction dictionary.
    This needs to return a 'success' or 'fail' after
    processing the transaction."""
    pass


@app.route('/banks/<int:id>/users', methods=['GET'])
async def get_bank_users_by_id(id):
    pass


@app.route('/banks/<int:id>', methods=['GET'])
async def get_bank_by_id(id):
    pass


@app.route('/', methods=['GET'])
def default():
    return 'API'

app.run()