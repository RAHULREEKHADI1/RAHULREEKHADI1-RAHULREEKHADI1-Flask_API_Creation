from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.exceptions import HTTPException
from dotenv import load_dotenv

db = SQLAlchemy()
load_dotenv()

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    import os
    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY"),
        SQLALCHEMY_DATABASE_URI=os.getenv("DATABASE_URL"),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        EBUG=False
    )

    if test_config:
        app.config.update(test_config)

    db.init_app(app)

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

