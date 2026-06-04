from ..extensions import db
from datetime import datetime


class User(db.Model):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum("owner", "admin"), nullable=False, default="owner")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    hostels = db.relationship("Hostel", backref="owner", lazy=True, cascade="all, delete")

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
