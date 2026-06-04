from flask import Flask
from .extensions import db, jwt, migrate
from config import Config
from flask_cors import CORS


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.hostel_routes import hostel_bp
    from .routes.room_routes import room_bp
    from .routes.image_routes import image_bp
    from .routes.review_routes import review_bp
    from .routes.search_routes import search_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(hostel_bp, url_prefix="/api/hostels")
    app.register_blueprint(room_bp, url_prefix="/api/rooms")
    app.register_blueprint(image_bp, url_prefix="/api/images")
    app.register_blueprint(review_bp, url_prefix="/api/reviews")
    app.register_blueprint(search_bp, url_prefix="/api/search")

    return app
