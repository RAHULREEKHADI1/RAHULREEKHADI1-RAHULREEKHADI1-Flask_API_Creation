from flask import request, g
from datetime import datetime
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

def start_timer():
    g.start = datetime.utcnow()

def log_request(response):
    if request.path.startswith('/logs') or request.method == 'OPTIONS':
        return response

    try:
        end = datetime.utcnow()
        duration = (end - g.start).total_seconds() * 1000 if hasattr(g, 'start') else 0

        api_key = request.headers.get("X-API-KEY") or request.args.get("api_key")
        if not api_key:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Api-Key "):
                api_key = auth_header.split(" ")[1]
        

        from app.models.api_request_log import APIRequestLog
        from app.models.api_key import APIKey
        from app.extensions import db
        
        found_user_id = getattr(g, 'user_id', None)
        if not found_user_id:
            try:
                verify_jwt_in_request(optional=True)
                found_user_id = get_jwt_identity()
            except:
                pass
        
        if not found_user_id and api_key:
            key_record = APIKey.query.filter_by(key=api_key).first()
            if key_record:
                found_user_id = key_record.user_id
        
        if found_user_id is None:
            return response

        log = APIRequestLog(
            endpoint=request.path,
            method=request.method,
            api_key=api_key,
            status_code=response.status_code,
            response_time_ms=duration,
            timestamp=datetime.utcnow(),
            user_id=found_user_id
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Logging failed:", e)

    return response