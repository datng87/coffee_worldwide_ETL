from .app import db


class coffee(db.Model):
    __tablename__ = 'coffee_worldwide'
    Country_Code = db.Column(db.String(128)) 
    Country_Name = db.Column(db.String(128),primary_key=True) 
    Market_Year = db.Column(db.Integer,primary_key=True) 
    Arabica_Production = db.Column(db.Integer) 
    Robusta_Production = db.Column(db.Integer) 
    Other_Production = db.Column(db.Integer) 
    Total_Production = db.Column(db.Integer) 
    Bean_Exports = db.Column(db.Integer) 
    Roast_Ground_Exports = db.Column(db.Integer) 
    Soluble_Exports = db.Column(db.Integer) 
    Total_Exports = db.Column(db.Integer) 
    Bean_Imports = db.Column(db.Integer) 
    Roast_Ground_Imports = db.Column(db.Integer) 
    Soluble_Imports = db.Column(db.Integer) 
    Total_Imports = db.Column(db.Integer) 
    Roast_Ground_consumption = db.Column(db.Integer) 
    Soluble_consumption = db.Column(db.Integer) 
    Total_consumption = db.Column(db.Integer) 

    def __repr__(self):
        return '<coffee %r>' % (self.name)
