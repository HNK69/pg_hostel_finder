from flask import Blueprint, request, jsonify
from ..models import Hostel, Room
from ..extensions import db

search_bp = Blueprint("search", __name__)


@search_bp.route("/hostels", methods=["GET"])
def search_hostels():
    """
    Query params:
      city        - filter by city (case-insensitive)
      area        - filter by area (case-insensitive)
      room_type   - single | double | triple
      min_rent    - minimum rent
      max_rent    - maximum rent
      available   - "true" to show only hostels with available beds
    """
    query = Hostel.query

    city = request.args.get("city")
    area = request.args.get("area")
    room_type = request.args.get("room_type")
    min_rent = request.args.get("min_rent", type=float)
    max_rent = request.args.get("max_rent", type=float)
    available = request.args.get("available", "").lower() == "true"

    if city:
        query = query.filter(Hostel.city.ilike(f"%{city}%"))
    if area:
        query = query.filter(Hostel.area.ilike(f"%{area}%"))

    # Join with rooms only when room-level filters are requested
    if room_type or min_rent is not None or max_rent is not None or available:
        query = query.join(Room, Room.hostel_id == Hostel.hostel_id)

        if room_type:
            if room_type not in ("single", "double", "triple"):
                return jsonify({"error": "room_type must be 'single', 'double', or 'triple'"}), 400
            query = query.filter(Room.room_type == room_type)
        if min_rent is not None:
            query = query.filter(Room.rent >= min_rent)
        if max_rent is not None:
            query = query.filter(Room.rent <= max_rent)
        if available:
            query = query.filter(Room.available_beds > 0)

    hostels = query.distinct().all()
    return jsonify([h.to_dict() for h in hostels]), 200
