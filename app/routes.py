from app import app, db
from flask import render_template, request, jsonify, redirect, url_for
from .utils import valid_url, generate_short
from .models import Url, User
from flask_login import current_user, login_user, logout_user

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
    return render_template('index.html', title='Home|RollCall')

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

    return jsonify({'longURL': url.longurl, 'shortURL': f'{request.host_url}{url.short}'})

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
            return render_template('login.html', error='Please input all fields')

        user = User.query.filter_by(email=email).first()
        if user is None or not user.check_password(password):
            return render_template('login.html', error='Invalid email/password')
        
        login_user(user)
        return redirect(url_for('index'))

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']

        if not email or not password or not name:
            return render_template('register.html', error='Please input all fields')

        if User.email_exist(email=email):
            return render_template('register.html', error='A user with the specified email already exist')
        
        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        return render_template('index.html')

    return render_template('register.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))