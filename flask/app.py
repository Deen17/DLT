"""
A sample Hello World server.
"""
import os
from flask import Flask


# pylint: disable=C0103
app = Flask(__name__)

@app.route('/')
def hello():
    """Return a friendly HTTP greeting."""
    message = "Hello World!"
    return message

@app.route('/users/<int:id>', methods=['GET'])
async def get_user_details(id):
    pass


@app.route('/users/<int:id>/transactions', methods=['GET'])
async def get_user_transaction_list(id):
    pass


@app.route('/users/transaction/<int:id>', methods=['POST'])
async def post_transaction(id):
    pass


@app.route('/banks/<int:id>/users', methods=['GET'])
async def get_bank_users(id):
    pass


@app.route('/banks/<int:id>', methods=['GET'])
async def get_bank(id):
    pass


@app.route('/', methods=['GET'])
def default():
    return 'API'



if __name__ == '__main__':
    server_port = os.environ.get('PORT')
    if server_port is None:
        print("error: PORT environment variable not set")
        exit(1)

    app.run(debug=False, port=server_port, host='0.0.0.0', threaded=True)
