from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from ..extensions import db
from ..models import User

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required = ["name", "email", "password", "role"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"'{field}' is required"}), 400

    if data["role"] not in ("owner", "admin"):
        return jsonify({"error": "role must be 'owner' or 'admin'"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    hashed_pw = generate_password_hash(data["password"])
    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed_pw,
        role=data["role"],
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "email and password are required"}), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.user_id), additional_claims={"role": user.role})
    return jsonify({"access_token": token, "user": user.to_dict()}), 200
