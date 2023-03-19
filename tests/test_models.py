from app.models import User, Url

def test_new_user():
    user = User(name='Okechukwu', email='Okechukwu@example.com')
    user.set_password('123456789')

    assert user.name == 'Okechukwu'
    assert user.email == 'Okechukwu@example.com'
    assert user.password_hash != '123456789'
    assert user.check_password('123456789') == True
    assert user.check_password('cat') == False

def test_url():
    url = Url(longurl='https://www.google.com', short='aBcDeF56')

    assert url.longurl == 'https://www.google.com'
    assert url.short == 'aBcDeF56'
    assert len(url.short) == 8
