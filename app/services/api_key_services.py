from app.models.api_key import APIKey
from app.extensions import db
import secrets

def create_api_key(client_name, user_id, daily_limit=1000):
    key = APIKey(client_name=client_name, daily_limit=daily_limit,user_id=user_id,key=secrets.token_urlsafe(32))
    db.session.add(key)
    db.session.commit()
    return key

def regenerate_api_key(key_id):
    if hasattr(key_id, 'id'):
        key_id = key_id.id
    key = APIKey.query.get_or_404(key_id)
    key.key = secrets.token_hex(32)
    db.session.commit()
    return key

def toggle_api_key(key_id):
    if hasattr(key_id, 'id'):
        key_id = key_id.id
    key = APIKey.query.get_or_404(key_id)
    key.is_active = not key.is_active
    db.session.commit()
    return key
