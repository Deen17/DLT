from api import app

from api import bp as api_bp
app.register_blueprint(api_bp, url_prefix='/api')
