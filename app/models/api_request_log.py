from app.extensions import db
from datetime import datetime

class APIRequestLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    endpoint = db.Column(db.String(200))
    method = db.Column(db.String(10))
    api_key = db.Column(db.String(64), nullable=True)
    status_code = db.Column(db.Integer)
    response_time_ms = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
