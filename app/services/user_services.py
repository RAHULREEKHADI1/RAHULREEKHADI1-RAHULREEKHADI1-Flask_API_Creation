from app import db
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import BadRequest, Conflict, NotFound, Unauthorized
from flask_jwt_extended import create_access_token,create_refresh_token
from email_validator import validate_email, EmailNotValidError
import re


def signup(data):
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()
    role = data.get("role", "user")

    if not name or not email or not password:
        raise BadRequest("Name, Password and email are required")
    
    if not re.fullmatch(r"[A-Za-z ]+", name):
        raise BadRequest("Name can contain only alphabets and spaces")
    
    if len(password) < 8:
        raise BadRequest("Password must be at least 8 characters long")
    
    try:
        email = validate_email(email).email
    except EmailNotValidError:
        raise BadRequest("Invalid email format")

    user = User(name=name, email=email,role=role)
    user.set_password(password)

    db.session.add(user)
    print("what is the behaviour")
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise Conflict("Email already exists")
    
    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})

    return {
        "user": user.to_dict(),
        "access_token": access_token,
    }
    

def login(data):
    email = data.get("email","").strip()
    password = data.get("password","").strip()

    if not email or not password:
        raise BadRequest("Email and password are required")
    
    try:
        email = validate_email(email).email
    except EmailNotValidError:
        raise BadRequest("Invalid email format")

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        raise Unauthorized("Invalid email or password")

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    refresh_token = create_refresh_token(identity=str(user.id), additional_claims={"role": user.role})

    return {
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token":refresh_token
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


def refresh_access_token(user_id):
    user = User.query.get_or_404(user_id)
    return create_access_token(identity=str(user_id), additional_claims={"role": user.role})
