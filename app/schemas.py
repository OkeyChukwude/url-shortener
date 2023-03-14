from app import ma
from .models import Url, User

class URLSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Url
        
    id = ma.auto_field()
    longurl = ma.auto_field()
    short = ma.auto_field()
    clicks = ma.auto_field()
    userId = ma.auto_field()
    timestamp = ma.auto_field()
    
