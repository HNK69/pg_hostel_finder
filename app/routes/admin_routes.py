from flask import Blueprint, jsonify
from ..models.user import User
from ..models.hostel import Hostel
from ..models.room import Room
from ..models.review import Review
from ..extensions import db


admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/stats", methods=["GET"])
def admin_stats():
    return jsonify({
        "users": User.query.count(),
        "hostels": Hostel.query.count(),
        "rooms": Room.query.count(),
        "reviews": Review.query.count()
    })

@admin_bp.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()

    return jsonify([
        {
            "user_id": user.user_id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "created_at": user.created_at.isoformat()
        }
        for user in users
    ])

@admin_bp.route("/hostels", methods=["GET"])
def get_hostels():
    hostels = Hostel.query.all()

    return jsonify([
        {
            "hostel_id": hostel.hostel_id,
            "hostel_name": hostel.hostel_name,
            "city": hostel.city,
            "area": hostel.area,
            "owner_id": hostel.owner_id
        }
        for hostel in hostels
    ])

@admin_bp.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = Review.query.all()

    return jsonify([
        {
            "review_id": review.review_id,
            "rating": review.rating,
            "comment": review.comment
        }
        for review in reviews
    ])


@admin_bp.route("/hostels/<int:hostel_id>", methods=["DELETE"])
def delete_hostel(hostel_id):
    hostel = Hostel.query.get(hostel_id)

    if not hostel:
        return jsonify({
            "error": "Hostel not found"
        }), 404

    db.session.delete(hostel)
    db.session.commit()

    return jsonify({
        "message": "Hostel deleted successfully"
    })