# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') 

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from .models import coffee


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/coffee")
def pals():
    results = db.session.query(coffee.Country_Code, coffee.Country_Name, coffee.Market_Year, coffee.Arabica_Production, coffee.Robusta_Production, coffee.Other_Production,
                               coffee.Total_Production, coffee.Bean_Exports, coffee.Roast_Ground_Exports, coffee.Soluble_Exports, coffee.Total_Exports, coffee.Bean_Imports,
                               coffee.Roast_Ground_Imports, coffee.Soluble_Imports, coffee.Total_Imports, coffee.Roast_Ground_consumption, coffee.Soluble_consumption, coffee.Total_consumption).all()

    Country_Code = [result[0] for result in results]
    Country_Name = [result[1] for result in results]
    Market_Year = [result[2] for result in results]
    Arabica_Production = [result[3] for result in results]
    Robusta_Production = [result[4] for result in results]
    Other_Production = [result[5] for result in results]
    Total_Production = [result[6] for result in results]
    Bean_Exports = [result[7] for result in results]
    Roast_Ground_Exports = [result[8] for result in results]
    Soluble_Exports = [result[9] for result in results]
    Total_Exports = [result[10] for result in results]
    Bean_Imports = [result[11] for result in results]
    Roast_Ground_Imports = [result[12] for result in results]
    Soluble_Imports = [result[13] for result in results]
    Total_Imports = [result[14] for result in results]
    Roast_Ground_consumption = [result[15] for result in results]
    Soluble_consumption = [result[16] for result in results]
    Total_consumption = [result[17] for result in results]
    

    coffee_data = [{
        "Country_Code": Country_Code,
        "Country_Name": Country_Name,
        "Market_Year": Market_Year,
        "Arabica_Production": Arabica_Production,
        "Robusta_Production": Robusta_Production,
        "Other_Production": Other_Production,
        "Total_Production": Total_Production,
        "Bean_Exports": Bean_Exports,
        "Roast_Ground_Exports": Roast_Ground_Exports,
        "Soluble_Exports": Soluble_Exports,
        "Total_Exports": Total_Exports,
        "Bean_Imports": Bean_Imports,
        "Roast_Ground_Imports": Roast_Ground_Imports,
        "Soluble_Imports": Soluble_Imports,
        "Total_Imports": Total_Imports,
        "Roast_Ground_consumption": Roast_Ground_consumption,
        "Soluble_consumption": Soluble_consumption,
        "Total_consumption": Total_consumption,
    }]

    return jsonify(coffee_data)

if __name__ == "__main__":
    app.run()
