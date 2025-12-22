from app import db
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import BadRequest, Conflict, NotFound, Unauthorized
from flask_jwt_extended import create_access_token


def signup(data):
    if not data.get("name") or not data.get("email") or not data.get("password"):
        raise BadRequest("Name, Password and email are required")

    user = User(name=data["name"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    print("what is the behaviour")
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("Email already exists")
    
    access_token = create_access_token(identity=str(user.id))

    return {
        "user": user.to_dict(),
        "access_token": access_token
    }
    

def login(data):
    if not data.get("email") or not data.get("password"):
        raise BadRequest("Email and password are required")

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        raise Unauthorized("Invalid email or password")

    access_token = create_access_token(identity=str(user.id))

    return {
        "user": user.to_dict(),
        "access_token": access_token
    }


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
