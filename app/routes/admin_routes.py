from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.utils.decorators import role_required
from app.models.user import User
from app.models.api_key import APIKey
from app.models.api_request_log import APIRequestLog
from app.services.api_key_services import create_api_key, regenerate_api_key, toggle_api_key

admin_api = Blueprint("admin_api", __name__, url_prefix="/admin")

@admin_api.route("/api-keys", methods=["POST"])
@jwt_required()
@role_required("admin")
def admin_create_key():
    data = request.get_json() or {}
    target_user_id = data.get("user_id")
    if not target_user_id:
        return jsonify({"error": "user_id is required"}), 400
    
    key = create_api_key(data.get("client_name", "Admin Issued"), target_user_id, data.get("daily_limit", 1000))
    return jsonify({"success": True, "key": key.key}), 201

@admin_api.route("/api-keys/<int:key_id>/toggle", methods=["PUT"])
@jwt_required()
@role_required("admin")
def admin_toggle_key(key_id):
    api_key = APIKey.query.get_or_404(key_id)
    toggle_api_key(api_key)
    return jsonify({"success": True, "is_active": api_key.is_active})

@admin_api.route("/api-keys/<int:key_id>/regenerate", methods=["PUT"])
@jwt_required()
@role_required("admin")
def admin_regenerate_key(key_id):
    api_key = APIKey.query.get_or_404(key_id)
    regenerate_api_key(api_key)
    return jsonify({"success": True, "new_key": api_key.key})

@admin_api.route("/users/<int:user_id>/keys", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_specific_user_keys(user_id):
    keys = APIKey.query.filter_by(user_id=user_id).all()
    return jsonify({
        "success": True,
        "keys": [{"id": k.id, "key": k.key, "client_name": k.client_name, "is_active": k.is_active} for k in keys]
    })

@admin_api.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_all_users():
    users = User.query.all()
    user_list = []
    for user in users:
        total_requests = APIRequestLog.query.filter_by(user_id=user.id).count()
        key_obj = APIKey.query.filter_by(user_id=user.id).first()
        user_list.append({
            "id": user.id, "name": user.name, "email": user.email,
            "total_requests": total_requests,
            "key_id": key_obj.id if key_obj else None,
            "api_key": key_obj.key if key_obj else "No Key Issued",
            "is_active": key_obj.is_active if key_obj else False
        })
    return jsonify({"success": True, "users": user_list}), 200