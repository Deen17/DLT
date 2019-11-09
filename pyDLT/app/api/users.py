from app.api import bp
import asyncio


@bp.route('/users/<int:id>', methods=['GET'])
async def get_user_details(id):
    pass


@bp.route('/users/<int:id>/transactions', methods=['GET'])
async def get_user_transaction_list(id):
    pass


@bp.route('/users/transaction/<int:id>', methods=['POST'])
async def post_transaction(id):
    pass


@bp.route('/banks/<int:id>/users', methods=['GET'])
async def get_bank_users(id):
    pass


@bp.route('/banks/<int:id>', methods=['GET'])
async def get_bank(id):
    pass


@bp.route('/', methods=['GET'])
def default():
    return 'API'
