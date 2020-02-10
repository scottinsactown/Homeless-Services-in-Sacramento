# Flask app for HMIS

from flask import Flask, jsonify, render_template
import pandas as pd
from sqlalchemy import create_engine
from config import username, password
import numpy as np # will need?

app = Flask(__name__, static_folder='static')

engine = create_engine('postgresql://{}:{}@localhost:5432/HMIS_db'.format(username, password))

conn = engine.connect()

@app.route('/')
def home():
    return render_template('index.html')

# Add routes to pull table views
# Activity data
@app.route('/api/INSERT>',defaults={'NEED?'})
def get_activity (YEAR OR MONTH OR BOTH?):
    sql = 'ADD CODE'
    data = pd.read_sql(sql=sql,con=conn)
    # are we doing any additional data transformation here?
    response = data.to_dict(orient='list')
    return jsonify(response)

# Outcome data

# Demographic data

if __name__ == "__main__":
    app.run(debug=True)


