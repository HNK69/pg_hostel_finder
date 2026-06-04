from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Hostel

hostel_bp = Blueprint("hostels", __name__)


@hostel_bp.route("/", methods=["GET"])
def get_all_hostels():
    hostels = Hostel.query.all()
    return jsonify([h.to_dict() for h in hostels]), 200


@hostel_bp.route("/<int:hostel_id>", methods=["GET"])
def get_hostel(hostel_id):
    hostel = Hostel.query.get_or_404(hostel_id)
    return jsonify(hostel.to_dict()), 200


@hostel_bp.route("/", methods=["POST"])
@jwt_required()
def create_hostel():
    data = request.get_json()
    owner_id = int(get_jwt_identity())

    if not data.get("hostel_name"):
        return jsonify({"error": "'hostel_name' is required"}), 400

    hostel = Hostel(
        owner_id=owner_id,
        hostel_name=data["hostel_name"],
        description=data.get("description"),
        city=data.get("city"),
        area=data.get("area"),
        address=data.get("address"),
        contact_phone=data.get("contact_phone"),
    )
    db.session.add(hostel)
    db.session.commit()
    return jsonify({"message": "Hostel created", "hostel": hostel.to_dict()}), 201


@hostel_bp.route("/<int:hostel_id>", methods=["PUT"])
@jwt_required()
def update_hostel(hostel_id):
    hostel = Hostel.query.get_or_404(hostel_id)
    owner_id = int(get_jwt_identity())

    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    updatable = ["hostel_name", "description", "city", "area", "address", "contact_phone"]
    for field in updatable:
        if field in data:
            setattr(hostel, field, data[field])

    db.session.commit()
    return jsonify({"message": "Hostel updated", "hostel": hostel.to_dict()}), 200


@hostel_bp.route("/<int:hostel_id>", methods=["DELETE"])
@jwt_required()
def delete_hostel(hostel_id):
    hostel = Hostel.query.get_or_404(hostel_id)
    owner_id = int(get_jwt_identity())

    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(hostel)
    db.session.commit()
    return jsonify({"message": "Hostel deleted"}), 200


@hostel_bp.route("/<int:hostel_id>/rooms", methods=["GET"])
def get_hostel_rooms(hostel_id):
    hostel = Hostel.query.get_or_404(hostel_id)
    return jsonify([r.to_dict() for r in hostel.rooms]), 200


@hostel_bp.route("/<int:hostel_id>/images", methods=["GET"])
def get_hostel_images(hostel_id):
    hostel = Hostel.query.get_or_404(hostel_id)
    return jsonify([i.to_dict() for i in hostel.images]), 200


@hostel_bp.route("/<int:hostel_id>/reviews", methods=["GET"])
def get_hostel_reviews(hostel_id):
    hostel = Hostel.query.get_or_404(hostel_id)
    return jsonify([r.to_dict() for r in hostel.reviews]), 200
