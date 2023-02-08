from app import app
from flask import render_template, request, jsonify, make_response
from .utils import valid_url, generateshorts

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
def short():
    long_url = request.json.get('longURL')
    alias = request.json.get('alias')

    is_valid_url = valid_url(long_url)

    if is_valid_url is None:
        return jsonify({'error': {'message': 'Invalid URL'}})

    short = generateshorts()

    return jsonify({'longURL': long_url, 'shortURL': f'{request.host_url}/{short}'})
