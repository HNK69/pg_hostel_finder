from ..extensions import db


class HostelImage(db.Model):
    __tablename__ = "hostel_images"

    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey("hostels.hostel_id", ondelete="CASCADE"), nullable=False)
    image_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            "image_id": self.image_id,
            "hostel_id": self.hostel_id,
            "image_url": self.image_url,
        }
