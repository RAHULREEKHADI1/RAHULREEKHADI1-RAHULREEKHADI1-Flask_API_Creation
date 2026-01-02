from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.api_request_log import APIRequestLog
from sqlalchemy import func
from datetime import datetime
from app.extensions import db
from app.models.user import User

analytics_api = Blueprint("analytics_api", __name__, url_prefix="/analytics")


@analytics_api.route("/total-requests", methods=["GET"])
@jwt_required()
def total_requests():
    start = request.args.get("start")
    end = request.args.get("end")    

    query = get_base_query()
    if start:
        try: query = query.filter(APIRequestLog.timestamp >= datetime.fromisoformat(start))
        except: pass
    if end:
        try: query = query.filter(APIRequestLog.timestamp <= datetime.fromisoformat(end))
        except: pass

    total = query.count()
    return jsonify({"total_requests": total})


@analytics_api.route("/top-endpoints", methods=["GET"])
@jwt_required()
def top_endpoints():
    limit = request.args.get("limit", 5, type=int)
    query = get_base_query()
    result = (
        query
        .with_entities(APIRequestLog.endpoint, func.count(APIRequestLog.id).label("count"))
        .group_by(APIRequestLog.endpoint)
        .order_by(func.count(APIRequestLog.id).desc())
        .limit(limit)
        .all()
    )

    return jsonify([{"endpoint": r.endpoint, "count": r.count} for r in result])


@analytics_api.route("/error-rate", methods=["GET"])
@jwt_required()
def error_rate():
    base_query = get_base_query()
    total = base_query.count()
    errors = base_query.filter(APIRequestLog.status_code >= 400).count()

    rate = (errors / total * 100) if total else 0
    return jsonify({"total_requests": total, "error_requests": errors, "error_rate_percent": rate})

def get_base_query():
    current_user_id = get_jwt_identity()
    
    if not current_user_id:
        return None

    user = User.query.get(current_user_id)
    target_user_id = request.args.get("user_id", type=int)
    api_key_filter = request.args.get("api_key")
    
    query = APIRequestLog.query

    if user and user.role == 'admin' and target_user_id:
        return query.filter_by(user_id=target_user_id)

    if api_key_filter:
        return query.filter_by(api_key=api_key_filter)
 
    return query.filter_by(user_id=current_user_id)