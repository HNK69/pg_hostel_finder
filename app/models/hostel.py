from ..extensions import db
from datetime import datetime


class Hostel(db.Model):
    __tablename__ = "hostels"

    hostel_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    hostel_name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    city = db.Column(db.String(100))
    area = db.Column(db.String(100))
    address = db.Column(db.Text)
    contact_phone = db.Column(db.String(15))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    rooms = db.relationship("Room", backref="hostel", lazy=True, cascade="all, delete")
    images = db.relationship("HostelImage", backref="hostel", lazy=True, cascade="all, delete")
    reviews = db.relationship("Review", backref="hostel", lazy=True, cascade="all, delete")

    def to_dict(self):
        return {
            "hostel_id": self.hostel_id,
            "owner_id": self.owner_id,
            "hostel_name": self.hostel_name,
            "description": self.description,
            "city": self.city,
            "area": self.area,
            "address": self.address,
            "contact_phone": self.contact_phone,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
