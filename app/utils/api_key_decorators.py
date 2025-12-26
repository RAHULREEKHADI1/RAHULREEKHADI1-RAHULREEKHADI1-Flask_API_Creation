from functools import wraps
from flask import request, jsonify
from app.models.api_key import APIKey

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

        # Optional: increment usage or check daily limit
        return func(*args, **kwargs)
    return wrapper
