from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.utils.decorators import role_required
from app.models.api_request_log import APIRequestLog
from sqlalchemy import func
from datetime import datetime

analytics_api = Blueprint("analytics_api", __name__, url_prefix="/admin/analytics")


@analytics_api.route("/total-requests", methods=["GET"])
@jwt_required()
@role_required("admin")
def total_requests():
    start = request.args.get("start")
    end = request.args.get("end")    

    query = APIRequestLog.query
    if start:
        query = query.filter(APIRequestLog.timestamp >= start)
    if end:
        query = query.filter(APIRequestLog.timestamp <= end)

    total = query.count()
    return jsonify({"total_requests": total})


@analytics_api.route("/top-endpoints", methods=["GET"])
@jwt_required()
@role_required("admin")
def top_endpoints():
    limit = request.args.get("limit", 5, type=int)
    result = (
        APIRequestLog.query
        .with_entities(APIRequestLog.endpoint, func.count(APIRequestLog.id).label("count"))
        .group_by(APIRequestLog.endpoint)
        .order_by(func.count(APIRequestLog.id).desc())
        .limit(limit)
        .all()
    )

    return jsonify([{"endpoint": r.endpoint, "count": r.count} for r in result])


@analytics_api.route("/error-rate", methods=["GET"])
@jwt_required()
@role_required("admin")
def error_rate():
    total = APIRequestLog.query.count()
    errors = APIRequestLog.query.filter(APIRequestLog.status_code >= 400).count()

    rate = (errors / total * 100) if total else 0
    return jsonify({"total_requests": total, "error_requests": errors, "error_rate_percent": rate})
