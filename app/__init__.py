from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from datetime import timedelta

db = SQLAlchemy()
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
    jwt = JWTManager(app)

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        return jsonify({
            "error": e.description
        }), e.code


    from .routes.user_routes import api
    app.register_blueprint(api)

    with app.app_context():
        db.create_all()

    return app

