from flask import Blueprint, jsonify
from app.utils.api_key_decorators import api_key_required

client_api = Blueprint("client_api", __name__, url_prefix="/api")

@client_api.route("/data")
@api_key_required
def get_data():
    return jsonify({"msg": "Success! You accessed protected data."})
