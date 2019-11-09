from app.api import bp
import asyncio


@bp.route('/users/<int:id>', methods=['GET'])
async def get_user_details_by_userid(id):
    pass


@bp.route('/users/<int:id>/transactions', methods=['GET'])
async def get_user_transaction_list_by_userid(id):
    pass


@bp.route('/users/transaction/<int:id>', methods=['POST'])
async def post_transaction():
    """the request object contains a transaction dictionary.
    This needs to return a 'success' or 'fail' after
    processing the transaction."""
    pass


@bp.route('/banks/<int:id>/users', methods=['GET'])
async def get_bank_users_by_id(id):
    pass


@bp.route('/banks/<int:id>', methods=['GET'])
async def get_bank_by_id(id):
    pass


@bp.route('/', methods=['GET'])
def default():
    return 'API'
