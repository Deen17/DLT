from flask import Blueprint, Flask

bp = Blueprint('api', __name__)


# from app.api import users, errors


def create_app():
    app = Flask(__name__)

    from app.api import bp as api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
