from app import app, db
from flask import render_template, request, jsonify, redirect
from .utils import valid_url, generate_short
from .models import Url

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

    if is_valid_url is None:
        return jsonify({'error': {'message': 'Invalid URL'}})

    short = generate_short()

    while True:
        short = generate_short()
        short_exist = Url.query.filter_by(short=short).first()

        if short_exist is None:
            break

    url = Url(longurl=long_url, short=short, )
    db.session.add(url)
    db.session.commit()

    return jsonify({'longURL': long_url, 'shortURL': f'{request.host_url}{short}'})

@app.route('/<short>')
def redirect_short(short):
    url = Url.query.filter_by(short=short).first()

    if url is None:
        return  render_template('404.html')

    url.clicks += 1
    db.session.commit()

    return redirect(url.longurl)