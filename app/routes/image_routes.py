from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..extensions import db
from ..models import HostelImage, Hostel

image_bp = Blueprint("images", __name__)


@image_bp.route("/", methods=["POST"])
@jwt_required()
def add_image():
    data = request.get_json()
    owner_id = int(get_jwt_identity())

    hostel_id = data.get("hostel_id")
    if not hostel_id:
        return jsonify({"error": "'hostel_id' is required"}), 400

    hostel = Hostel.query.get_or_404(hostel_id)
    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    if not data.get("image_url"):
        return jsonify({"error": "'image_url' is required"}), 400

    image = HostelImage(hostel_id=hostel_id, image_url=data["image_url"])
    db.session.add(image)
    db.session.commit()
    return jsonify({"message": "Image added", "image": image.to_dict()}), 201


@image_bp.route("/<int:image_id>", methods=["GET"])
def get_image(image_id):
    image = HostelImage.query.get_or_404(image_id)
    return jsonify(image.to_dict()), 200


@image_bp.route("/<int:image_id>", methods=["PUT"])
@jwt_required()
def update_image(image_id):
    image = HostelImage.query.get_or_404(image_id)
    owner_id = int(get_jwt_identity())

    hostel = Hostel.query.get_or_404(image.hostel_id)
    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()
    if not data.get("image_url"):
        return jsonify({"error": "'image_url' is required"}), 400

    image.image_url = data["image_url"]
    db.session.commit()
    return jsonify({"message": "Image updated", "image": image.to_dict()}), 200


@image_bp.route("/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_image(image_id):
    image = HostelImage.query.get_or_404(image_id)
    owner_id = int(get_jwt_identity())

    hostel = Hostel.query.get_or_404(image.hostel_id)
    if hostel.owner_id != owner_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted"}), 200
