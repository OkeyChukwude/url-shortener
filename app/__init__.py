import os
from flask import Flask
import config

app = Flask(__name__)
app.config.from_object(config.DevelopmentConfig)
print(app.config)

from app import routes