from datetime import datetime
from app import db

class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    longurl = db.Column(db.String(254), index=True, nullable=False)
    short = db.Column(db.String(8), index=True, unique=True, nullable=False)
    clicks = db.Column(db.Integer, index=True, default=0)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    
    def __ref__(self):
        return f'<URL: {self.longurl}, short: {self.shorturl}'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    urls = db.relationship('Url', backref='author', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.name}>'