from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Review, Hostel

review_bp = Blueprint("reviews", __name__)


@review_bp.route("/", methods=["POST"])
def add_review():
    data = request.get_json()

    hostel_id = data.get("hostel_id")
    if not hostel_id:
        return jsonify({"error": "'hostel_id' is required"}), 400

    Hostel.query.get_or_404(hostel_id)

    rating = data.get("rating")
    if rating is not None and not (1 <= int(rating) <= 5):
        return jsonify({"error": "rating must be between 1 and 5"}), 400

    review = Review(
        hostel_id=hostel_id,
        user_name=data.get("user_name"),
        rating=data.get("rating"),
        comment=data.get("comment"),
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({"message": "Review added", "review": review.to_dict()}), 201


@review_bp.route("/<int:review_id>", methods=["GET"])
def get_review(review_id):
    review = Review.query.get_or_404(review_id)
    return jsonify(review.to_dict()), 200


@review_bp.route("/<int:review_id>", methods=["DELETE"])
@jwt_required()
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    owner_id = int(get_jwt_identity())

    hostel = Hostel.query.get_or_404(review.hostel_id)
    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(review)
    db.session.commit()
    return jsonify({"message": "Review deleted"}), 200
