from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app import db, login
from flask_login import UserMixin

class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    longurl = db.Column(db.String(254), index=True, nullable=False)
    short = db.Column(db.String(8), index=True, unique=True, nullable=False)
    clicks = db.Column(db.Integer, index=True, default=0)
    userId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    
    def __ref__(self):
        return f'<URL: {self.longurl}, short: {self.shorturl}'

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    google_id = db.Column(db.String(128), nullable=True)
    name = db.Column(db.String(64), index=True, nullable=False)
    email = db.Column(db.String(120), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    urls = db.relationship('Url', backref='author', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def email_exist(email):
        user = User.query.filter_by(email=email).first()
        if user is not None:
            return True
        return False

    def __repr__(self):
        return f'<User {self.name}>'
    
@login.user_loader
def load_user(id):
    return User.query.get(int(id))