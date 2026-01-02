from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.api_request_log import APIRequestLog
from datetime import datetime
from app.models.user import User

log_api = Blueprint("log_api", __name__, url_prefix="/logs")

@log_api.route("/", methods=["GET"])
@jwt_required()
def get_logs():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        target_user_id = request.args.get("user_id", type=int)
        api_key_filter = request.args.get("api_key")
        status_code = request.args.get("status_code", type=int)
        start_date = request.args.get("start") 
        end_date = request.args.get("end")     
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 50, type=int)

        query = APIRequestLog.query

        if user.role == 'admin' and target_user_id:
            query = query.filter_by(user_id=target_user_id)

        elif api_key_filter and api_key_filter != "undefined":
            query = query.filter(APIRequestLog.api_key == api_key_filter)

        else:
            query = query.filter_by(user_id=current_user_id)
        
        if status_code:
            query = query.filter(APIRequestLog.status_code == status_code)
        
        if start_date:
            try:
                query = query.filter(APIRequestLog.timestamp >= datetime.fromisoformat(start_date))
            except (ValueError, TypeError):
                pass
                
        if end_date:
            try:
                query = query.filter(APIRequestLog.timestamp <= datetime.fromisoformat(end_date))
            except (ValueError, TypeError):
                pass

        paginated_logs = query.order_by(APIRequestLog.timestamp.desc()).paginate(
            page=page, 
            per_page=limit, 
            error_out=False
        )

        result = [
            {
                "timestamp": log.timestamp.isoformat() if log.timestamp else None,
                "endpoint": log.endpoint,
                "method": log.method,
                "api_key": log.api_key or "N/A",
                "status_code": log.status_code,
                "response_time_ms": round(log.response_time_ms, 2) if log.response_time_ms else 0
            }
            for log in paginated_logs.items
        ]

        return jsonify({
            "success": True,
            "page": paginated_logs.page,
            "total_pages": paginated_logs.pages,
            "total_logs": paginated_logs.total,
            "logs": result
        }), 200

    except Exception as e:
        print(f"Log Fetch Error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error"}), 500