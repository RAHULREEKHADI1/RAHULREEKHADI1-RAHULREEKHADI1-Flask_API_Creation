from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.services.api_key_services import create_api_key, regenerate_api_key, toggle_api_key
from app.utils.decorators import role_required
from app.models.user import User
from app.models.api_request_log import APIRequestLog

admin_api = Blueprint("admin_api", __name__, url_prefix="/admin")

@admin_api.route("/api-keys", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_api_key_route():
    data = request.get_json() or {}
    client_name = data.get("client_name")
    daily_limit = data.get("daily_limit", 1000)
    key = create_api_key(client_name, daily_limit)
    return jsonify({"key": key.key, "client_name": client_name, "daily_limit": daily_limit}), 201

@admin_api.route("/api-keys/<int:key_id>/regenerate", methods=["PUT"])
@jwt_required()
@role_required("admin")
def regenerate_api_key_route(key_id):
    key = regenerate_api_key(key_id)
    return jsonify({"msg": "API key regenerated", "new_key": key.key})

@admin_api.route("/api-keys/<int:key_id>/toggle", methods=["PUT"])
@jwt_required()
@role_required("admin")
def toggle_api_key_route(key_id):
    key = toggle_api_key(key_id)
    return jsonify({"msg": f"API key {'enabled' if key.is_active else 'disabled'}"})

@admin_api.route("/users", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_all_users_for_admin():
    try:
        users = User.query.all()
        user_list = []
        print(users)

        for user in users:
            total_requests = APIRequestLog.query.filter_by(user_id=user.id).count()
            
            user_list.append({
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "total_requests": total_requests,
                "joined_at": user.created_at.isoformat() if hasattr(user, 'created_at') else None
            })

        return jsonify({
            "success": True, 
            "users": user_list
        }), 200

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
