from ..extensions import db
from datetime import datetime


class Review(db.Model):
    __tablename__ = "reviews"

    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.hostel_id", ondelete="CASCADE"), nullable=False)
    user_name = db.Column(db.String(100))
    rating = db.Column(db.Integer)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "review_id": self.review_id,
            "hostel_id": self.hostel_id,
            "user_name": self.user_name,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
