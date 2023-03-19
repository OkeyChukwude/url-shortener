def test_login_page(app, client):
    response = client.get('/login')
    
    assert response.status_code == 200
    assert b'Login and start shortening and sharing' in response.data