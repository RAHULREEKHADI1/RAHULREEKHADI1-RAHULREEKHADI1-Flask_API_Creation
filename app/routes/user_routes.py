from flask import Blueprint, request, jsonify
from app.services.user_services import (
    create_user,
    get_all_users,
    get_user_by_id,
    update_user,
    delete_user
)

api = Blueprint("api", __name__)


@api.route("/")
def home_page():
    return jsonify({"message": "User API"}), 200


@api.route("/users", methods=["POST"])
def create_user_route():
    user = create_user(request.get_json() or {})
    return jsonify(user.to_dict()), 201


@api.route("/users", methods=["GET"])
def get_users_route():
    users = get_all_users()
    return jsonify([u.to_dict() for u in users]), 200


@api.route("/users/<int:id>", methods=["GET"])
def get_user_route(id):
    user = get_user_by_id(id)
    return jsonify(user.to_dict()), 200


@api.route("/users/<int:id>", methods=["PUT"])
def update_user_route(id):
    user = update_user(id, request.get_json() or {})
    return jsonify(user.to_dict()), 200


@api.route("/users/<int:id>", methods=["DELETE"])
def delete_user_route(id):
    delete_user(id)
    return jsonify({"message": "User deleted"}), 200
