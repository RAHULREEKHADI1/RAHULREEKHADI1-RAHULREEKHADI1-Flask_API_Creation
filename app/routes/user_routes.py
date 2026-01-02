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
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.extensions import limiter
from app.models.api_key import APIKey
from app.extensions import db
import secrets
from flask_cors import cross_origin

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

@api.route('/client/api/keys', methods=['POST', 'OPTIONS','GET'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
@jwt_required()
def create_key():

    if request.method == 'OPTIONS':
        return jsonify({"msg": "ok"}), 200
    
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        keys = APIKey.query.filter_by(user_id=int(user_id)).all()
        return jsonify([{
            "id": k.id,
            "client_name": k.client_name,
            "key": k.key,
            "is_active": k.is_active
        } for k in keys]), 200

    if request.method == 'POST':
        claims = get_jwt()
        user_role = claims.get("role")
        new_key = secrets.token_urlsafe(32)
        
        api_entry = APIKey(
            key=new_key, 
            user_id=int(user_id),
            client_name=request.json.get('name', 'Default Client')
        )
        
        db.session.add(api_entry)
        db.session.commit()
        
        return jsonify({
            "api_key": new_key,
            "id": api_entry.id,
            "role_confirmed": user_role
        }), 201

@api.route('/client/api/keys/<int:key_id>/toggle', methods=['PATCH'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
@jwt_required()
def toggle_key(key_id):
    user_id = int(get_jwt_identity())
    api_key = APIKey.query.filter_by(id=key_id, user_id=user_id).first_or_404()
    api_key.is_active = not api_key.is_active
    db.session.commit()
    
    return jsonify({
        "msg": f"Key {'enabled' if api_key.is_active else 'disabled'}",
        "is_active": api_key.is_active
    })

@api.route('/client/api/keys/<int:key_id>/regenerate', methods=['POST'])
@cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
@jwt_required()
def regenerate_key(key_id):
    user_id = int(get_jwt_identity())
    api_key = APIKey.query.filter_by(id=key_id, user_id=user_id).first_or_404()
    new_secret = secrets.token_urlsafe(32)
    api_key.key = new_secret    
    db.session.commit()
    return jsonify({"new_api_key": new_secret})

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
