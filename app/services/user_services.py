from app import db
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import BadRequest, Conflict, NotFound


def create_user(data):
    if not data.get("name") or not data.get("email"):
        raise BadRequest("Name and email are required")

    user = User(name=data["name"], email=data["email"])
    db.session.add(user)

    try:
        db.session.commit()
        return user
    except IntegrityError:
        db.session.rollback()
        raise Conflict("Email already exists")


def get_all_users():
    return User.query.all()


def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        raise NotFound("User not found")
    return user


def update_user(user_id, data):
    user = get_user_by_id(user_id)

    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)

    try:
        db.session.commit()
        return user
    except IntegrityError:
        db.session.rollback()
        raise Conflict("Email already exists")


def delete_user(user_id):
    user = get_user_by_id(user_id)
    db.session.delete(user)
    db.session.commit()
