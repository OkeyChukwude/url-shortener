from datetime import datetime
from app import db

class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    longurl = db.Column(db.String, index=True, unique=True)
    shorturl = db.Column(db.String, index=True, unique=True)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    
    def __ref__(self):
        return f'<URL: {self.longurl}, short: {self.shorturl}'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, index=True, unique=True)
    email = db.Column(db.String, index=True, unique=True)
    password_hash = db.Column(db.String(128))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    urls = db.relationship('Url', backref='author', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.name}>'