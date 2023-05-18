from app import app, db
from flask import render_template, request, jsonify, redirect, url_for, session, abort
from .utils import valid_url, generate_short
from .models import Url, User
from .schemas import URLSchema
from flask_login import current_user, login_user, logout_user, login_required
import os
from dotenv import load_dotenv
import requests

from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
GOOGLE_DISCOVERY_URL = (
    "https://accounts.google.com/.well-known/openid-configuration"
)
GOOGLE_PROJECT_ID = os.environ.get("GOOGLE_PROJECT_ID", None)
GOOGLE_REDIRECT_URLS = os.environ.get("GOOGLE_REDIRECT_URLS", None)

CLIENT_CONFIG = {"web": {
    "client_id": GOOGLE_CLIENT_ID,
    "project_id": GOOGLE_PROJECT_ID,
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri":"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": GOOGLE_CLIENT_SECRET,
    "redirect_uris": GOOGLE_REDIRECT_URLS
    }
}
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
flow = Flow.from_client_config(client_config=CLIENT_CONFIG, scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"], redirect_uri=GOOGLE_REDIRECT_URLS)

url_schema = URLSchema()

@app.errorhandler(404)
def not_found(error):
    return render_template('404.html')

@app.errorhandler(405)
def not_found(error):
    return render_template('405.html')

@app.errorhandler(500)
def not_found(error):
    return render_template('500.html')

@app.route('/')
@app.route('/index')
def index():
    user_id = current_user.id if current_user.is_authenticated else None
    return render_template('index.html', title='Home|RollCall', user=user_id)

@app.route('/shorten', methods=['POST'])
def create_short():
    long_url = request.json.get('longURL')
    alias = request.json.get('alias')

    is_valid_url = valid_url(long_url)

    if not is_valid_url:
        return jsonify({'error': {'message': 'Invalid URL'}})
    
    if current_user.is_authenticated and alias and Url.query.filter_by(short=alias).first():
        return jsonify({'error': {'message': 'Alias is not available'}})

    url = ''
    if current_user.is_authenticated and alias:
        url = Url(longurl=long_url, short=alias, userId=current_user.id)
        
    else:
        short = ''
        while True:
            short = generate_short()
            short_exist = Url.query.filter_by(short=short).first()

            if short_exist is None:
                break
        if current_user.is_authenticated:
            url = Url(longurl=long_url, short=short, userId=current_user.id)
        else:
            url = Url(longurl=long_url, short=short)
    
    db.session.add(url)
    db.session.commit()

    return jsonify({'longURL': url.longurl, 'shortURL': f'{request.host_url}{url.short}', 'timestamp': url.timestamp})

@app.route('/shorts', methods=['GET'])
@login_required
def get_shorts():
    user_id = current_user.id
    urls = map(lambda url: {'longURL': url_schema.dump(url)['longurl'], 'shortURL': f'{request.host_url}{url_schema.dump(url)["short"]}', 'timestamp': url_schema.dump(url)['timestamp'], 'clicks': url_schema.dump(url)['clicks']}, Url.query.filter_by(userId=user_id).all())
    return jsonify({'urls': list(urls)})

@app.route('/<short>')
def redirect_short(short):
    url = Url.query.filter_by(short=short).first()

    if url is None:
        return  render_template('404.html')

    url.clicks += 1
    db.session.commit()

    return redirect(url.longurl)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        if not email or not password:
            return render_template('login.html', error='Please input all fields', user=None)

        user = User.query.filter_by(email=email).first()
        if user is None or not user.check_password(password):
            return render_template('login.html', error='Invalid email/password', user=None)
        
        login_user(user)
        return redirect(url_for('index'))

    return render_template('login.html', user=None)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        if not email or not password or not name:
            return render_template('register.html', error='Please input all fields', user=None)

        if User.email_exist(email=email):
            return render_template('register.html', error='A user with the specified email already exist', user=None)
        
        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        return render_template('index.html', user=user_id)

    return render_template('register.html', user=None)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/login/google')
def google_login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)

@app.route("/login/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        abort(500)  # State does not match!

    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)

    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    user = User.query.filter_by(email=id_info.get('email')).first()
    if user is None:
        user = User(name=id_info.get('name'), email=id_info.get('email'), google_id=id_info.get("sub"))
        db.session.add(user)
        db.session.commit()

    login_user(user)
    return redirect(url_for('index'))