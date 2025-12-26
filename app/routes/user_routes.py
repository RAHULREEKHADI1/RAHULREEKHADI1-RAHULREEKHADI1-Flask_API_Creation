from flask import Blueprint, request, jsonify
from app.services.user_services import (
    signup,
    login,
    get_all_users,
    get_user_by_id,
    update_user,
    delete_user,
    refresh_access_token
)
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import limiter

api = Blueprint("api", __name__)


@api.route("/")
def home_page():
    return jsonify({"message": "User API"}), 200

@api.route("/login",methods=["POST"])
@limiter.limit("5 per minute")
def login_route():
    response = login(request.get_json() or {})
    return jsonify(response), 200


@api.route("/signup", methods=["POST"])
@limiter.limit("3 per minute")
def signup_route():
    response = signup(request.get_json() or {})
    return jsonify(response), 201


@api.route("/users", methods=["GET"])
@jwt_required()
def get_users_route():
    users = get_all_users()
    return jsonify([u.to_dict() for u in users]), 200


@api.route("/users/<int:id>", methods=["GET"])
@jwt_required()
def get_user_route(id):
    user = get_user_by_id(id)
    return jsonify(user.to_dict()), 200


@api.route("/users/<int:id>", methods=["PUT"])
@jwt_required()
def update_user_route(id):
    user = update_user(id, request.get_json() or {})
    return jsonify(user.to_dict()), 200


@api.route("/users/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_user_route(id):
    delete_user(id)
    return jsonify({"message": "User deleted"}), 200

@api.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_route():
    user_id = get_jwt_identity()
    token = refresh_access_token(user_id)
    return jsonify({"access_token": token}), 200



@api.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = get_user_by_id(user_id)
    return jsonify(user.to_dict()), 200
