from flask import request, g
from datetime import datetime

def start_timer():
    g.start = datetime.utcnow()

def log_request(response):
    try:
        end = datetime.utcnow()
        duration = (end - g.start).total_seconds() * 1000

        api_key = None
        auth_header = request.headers.get("Authorization")
        if auth_header:
            if auth_header.startswith("Api-Key "):
                api_key = auth_header.split(" ")[1]
                api_key = api_key[:4] + "***"
            elif auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                token = token[:4] + "***"


        print(f"[{datetime.utcnow()}] {request.method} {request.path} | "
              f"API Key: {api_key} | Status: {response.status_code} | Time: {duration:.2f}ms")

        from app.models.api_request_log import APIRequestLog
        from app.extensions import db
        log = APIRequestLog(
            endpoint=request.path,
            method=request.method,
            api_key=api_key,
            status_code=response.status_code,
            response_time_ms=duration,
            timestamp=datetime.utcnow()
        )
        db.session.add(log)
        db.session.commit()
    except Exception as e:
        print("Logging failed:", e)

    return response
