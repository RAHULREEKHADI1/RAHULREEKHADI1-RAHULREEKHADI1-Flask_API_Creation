from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256),nullable=False)
    role = db.Column(db.String(20), default="user") 
    api_keys = db.relationship('APIKey', backref='owner', lazy=True)

    def set_password(self,password):
        self.password_hash = generate_password_hash(
        password,
        method="pbkdf2:sha256",
        salt_length=16
    )

    def check_password(self,password):
        return check_password_hash(self.password_hash,password)

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email, "role": self.role}
