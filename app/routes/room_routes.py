from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import Room, Hostel

room_bp = Blueprint("rooms", __name__)


@room_bp.route("/", methods=["POST"])
@jwt_required()
def create_room():
    data = request.get_json()
    owner_id = int(get_jwt_identity())

    hostel_id = data.get("hostel_id")
    if not hostel_id:
        return jsonify({"error": "'hostel_id' is required"}), 400

    hostel = Hostel.query.get_or_404(hostel_id)
    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    if not data.get("room_type"):
        return jsonify({"error": "'room_type' is required"}), 400
    if data["room_type"] not in ("single", "double", "triple"):
        return jsonify({"error": "room_type must be 'single', 'double', or 'triple'"}), 400

    room = Room(
        hostel_id=hostel_id,
        room_type=data["room_type"],
        rent=data.get("rent"),
        capacity=data.get("capacity"),
        available_beds=data.get("available_beds"),
    )
    db.session.add(room)
    db.session.commit()
    return jsonify({"message": "Room created", "room": room.to_dict()}), 201


@room_bp.route("/<int:room_id>", methods=["GET"])
def get_room(room_id):
    room = Room.query.get_or_404(room_id)
    return jsonify(room.to_dict()), 200


@room_bp.route("/<int:room_id>", methods=["PUT"])
@jwt_required()
def update_room(room_id):
    room = Room.query.get_or_404(room_id)
    owner_id = int(get_jwt_identity())

    hostel = Hostel.query.get_or_404(room.hostel_id)
    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if "room_type" in data:
        if data["room_type"] not in ("single", "double", "triple"):
            return jsonify({"error": "room_type must be 'single', 'double', or 'triple'"}), 400
        room.room_type = data["room_type"]

    for field in ["rent", "capacity", "available_beds"]:
        if field in data:
            setattr(room, field, data[field])

    db.session.commit()
    return jsonify({"message": "Room updated", "room": room.to_dict()}), 200


@room_bp.route("/<int:room_id>", methods=["DELETE"])
@jwt_required()
def delete_room(room_id):
    room = Room.query.get_or_404(room_id)
    owner_id = int(get_jwt_identity())

    hostel = Hostel.query.get_or_404(room.hostel_id)
    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(room)
    db.session.commit()
    return jsonify({"message": "Room deleted"}), 200
