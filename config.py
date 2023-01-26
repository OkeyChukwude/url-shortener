import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')

class ProductionConfig(Config):
    FLASK_ENV = 'production'
    DEBUG = False

class DevelopmentConfig(Config):
    FLASK_ENV = 'development'
    DEBUG = True