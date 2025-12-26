from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.utils.decorators import role_required
from app.models.api_request_log import APIRequestLog

log_api = Blueprint("log_api", __name__, url_prefix="/admin/logs")

@log_api.route("/", methods=["GET"])
@jwt_required()
@role_required("admin")
def get_logs():
    api_key = request.args.get("api_key")
    status_code = request.args.get("status_code", type=int)
    start = request.args.get("start") 
    end = request.args.get("end")     
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 50, type=int)

    query = APIRequestLog.query

    if api_key:
        query = query.filter(APIRequestLog.api_key == api_key)
    if status_code:
        query = query.filter(APIRequestLog.status_code == status_code)
    if start:
        query = query.filter(APIRequestLog.timestamp >= start)
    if end:
        query = query.filter(APIRequestLog.timestamp <= end)

    logs = query.order_by(APIRequestLog.timestamp.desc()).paginate(page=page, per_page=limit)

    result = [
        {
            "timestamp": log.timestamp,
            "endpoint": log.endpoint,
            "method": log.method,
            "api_key": log.api_key,
            "status_code": log.status_code,
            "response_time_ms": log.response_time_ms
        }
        for log in logs.items
    ]

    return jsonify({
        "page": page,
        "total_pages": logs.pages,
        "total_logs": logs.total,
        "logs": result
    })
