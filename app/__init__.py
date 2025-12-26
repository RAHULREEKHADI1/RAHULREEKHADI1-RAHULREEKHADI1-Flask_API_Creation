from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException
from dotenv import load_dotenv
from datetime import timedelta
from .extensions import db, jwt
from app.services.request_logger import start_timer, log_request
from app.extensions import limiter

load_dotenv()


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    

    import os
    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY", "default_secret"),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL", "sqlite:///db.sqlite3"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        DEBUG=False,
        JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "supersecretkey"),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(minutes=5),
        JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=7)
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)
    jwt.init_app(app)
    limiter.init_app(app)

    app.before_request(start_timer)
    app.after_request(log_request)

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({
            "error": e.description
        }), e.code

    
    from .routes.user_routes import api
    app.register_blueprint(api)

    from .routes.admin_routes import admin_api
    app.register_blueprint(admin_api)

    from .routes.client_routes import client_api
    app.register_blueprint(client_api)

    from .routes.log_routes import log_api
    app.register_blueprint(log_api)

    from .routes.analytics_routes import analytics_api
    app.register_blueprint(analytics_api)

    with app.app_context():
        db.create_all()

    return app

