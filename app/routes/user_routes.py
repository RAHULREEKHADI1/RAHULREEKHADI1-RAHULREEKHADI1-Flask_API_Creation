from flask import Blueprint,request,jsonify
from app import db
from app.models.user import User
from sqlalchemy.exc import IntegrityError


api = Blueprint("api",__name__)


@api.route("/")
def home_page():
    return "This is my home page"


@api.route("/users",methods=["POST"])
def create_user():
    data = request.get_json() or {}

    if not data.get("name") or not data.get("email"):
        return jsonify({"error": "Name and email are required"}), 400

    user = User(name=data["name"], email=data["email"])
    db.session.add(user)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 409

    return jsonify(user.to_dict()), 201



@api.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([u.to_dict() for u in users])



@api.route("/users/<int:id>", methods=["GET"])
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify(user.to_dict()),200


@api.route("/users/<int:id>", methods=["PUT"])
def update_user(id):
    user = User.query.get_or_404(id)
    data = request.get_json()

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Email already exists"}), 409

    return jsonify(user.to_dict()), 200


@api.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}),200
