from ..extensions import db


class Room(db.Model):
    __tablename__ = "rooms"

    room_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.hostel_id", ondelete="CASCADE"), nullable=False)
    room_type = db.Column(db.Enum("single", "double", "triple"), nullable=False)
    rent = db.Column(db.Numeric(10, 2))
    capacity = db.Column(db.Integer)
    available_beds = db.Column(db.Integer)

    def to_dict(self):
        return {
            "room_id": self.room_id,
            "hostel_id": self.hostel_id,
            "room_type": self.room_type,
            "rent": float(self.rent) if self.rent is not None else None,
            "capacity": self.capacity,
            "available_beds": self.available_beds,
        }
