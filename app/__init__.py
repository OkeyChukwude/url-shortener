import os
from flask import Flask
import config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_marshmallow import Marshmallow

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
db = SQLAlchemy(app)
ma = Marshmallow(db)
migrate = Migrate(app, db)
login = LoginManager(app)

from app import routes, models