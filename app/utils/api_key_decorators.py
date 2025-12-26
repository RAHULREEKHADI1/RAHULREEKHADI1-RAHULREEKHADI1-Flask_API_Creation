from functools import wraps
from flask import request, jsonify
from app.models.api_key import APIKey
from datetime import datetime, timedelta
from app import db

def api_key_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Api-Key "):
            return jsonify({"msg": "API key missing"}), 401

        key_value = auth_header.split(" ")[1]
        key = APIKey.query.filter_by(key=key_value, is_active=True).first()
        if not key:
            return jsonify({"msg": "Invalid or inactive API key"}), 403

        now = datetime.utcnow()

        if key.last_reset is None or now - key.last_reset >= timedelta(days=1):
            key.daily_usage = 0
            key.last_reset = now
            db.session.commit()

        if key.daily_usage >= key.daily_limit:
            return jsonify({"msg": "Daily API quota exceeded"}), 429

        key.daily_usage += 1
        db.session.commit()

        return func(*args, **kwargs)
    return wrapper
