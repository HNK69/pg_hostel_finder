import os
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()


class Config:
    # Flask
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-production")
    DEBUG = os.environ.get("DEBUG", "False").lower() == "true"

    # MySQL / SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "mysql+pymysql://projectuser:project123@localhost/pg_hostel_finder"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-change-me")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES_HOURS", 24))
    )
