# Flask app for HMIS

from flask import Flask, jsonify
from flask_cors import CORS 
from sqlalchemy import create_engine
from sqlalchemy import create_engine, MetaData
from config import username, password
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

app = Flask(__name__, static_folder='static')
CORS(app)
engine = create_engine('postgresql://{}:{}@localhost:5432/HMIS_db'.format(username, password))


@app.route('/')
def home():
    return ('<h1>Place Holder</h1>')

# Add routes to pull table views
# Activity data
@app.route('/api')
def get_data():
    response = {'flow':{'yearly':{'in':{},
                             'out':{},
                             'active':{}},
                   'monthly':{'in':{},
                             'out':{},
                             'active':{}},
                   'top_5':{'2015':[],
                            '2016':[],
                            '2017':[],
                            '2018':[],
                            '2019':[]}},
                 'outcomes':{'yearly':{'exit_ph':{},
                                 'exit_all':{}
                                 ,'average':{}
                                 },
                       'monthly':{'exit_ph':{},
                                'exit_all':{}}},
            'demo':{'age':{'2015':[],
                            '2016':[],
                            '2017':[],
                            '2018':[],
                            '2019':[]},
                   'race':{'2015':[],
                            '2016':[],
                            '2017':[],
                            '2018':[],
                            '2019':[]},
                   'sex':{'2015':[],
                            '2016':[],
                            '2017':[],
                            '2018':[],
                            '2019':[]}}
                }

    with engine.connect() as c:
        rs = c.execute('Select * from yearly_in')
        for r in rs:
            response['flow']['yearly']['in'][r[0]] = r[1]
        rs = c.execute('Select * from yearly_out')
        for r in rs:
            response['flow']['yearly']['out'][r[0]] = r[1]
        rs = c.execute('Select * from monthly_in')
        for r in rs:
            response['flow']['monthly']['in'][r[0]] = r[1]
        rs = c.execute('Select * from monthly_out')
        for r in rs:
            response['flow']['monthly']['out'][r[0]] = r[1]
        rs = c.execute('Select * from num_active_yearly')
        for r in rs:
            response['flow']['yearly']['active'][r[0]] = r[1]+r[2]
        rs = c.execute('Select * from num_active_monthly')
        for r in rs:
            response['flow']['monthly']['active'][r[0]] = r[1]+r[2]
        rs = c.execute('Select * from top_5_programs')
        for r in rs:
            response['flow']['top_5'][r[0]].append([r[1], r[2]])

        rs = c.execute('Select * from yearly_to_ph')
        for r in rs:
            response['outcomes']['yearly']['exit_ph'][r[0]] = r[1]
        rs = c.execute('Select * from yearly_total_exit')
        for r in rs:
            response['outcomes']['yearly']['exit_all'][r[0]] = r[1]
        rs = c.execute('Select * from avg_to_ph')
        for r in rs:
            response['outcomes']['yearly']['average'][r[0]] = int(r[1])
        rs = c.execute('Select * from num_to_ph')
        for r in rs: 
            response['outcomes']['monthly']['exit_ph'][r[0]] = r[1]
        rs = c.execute('Select * from num_to_ph')
        for r in rs: 
            response['outcomes']['monthly']['exit_all'][r[0]] = r[2]

        rs = c.execute('Select * from yearly_age')
        for r in rs:
            response['demo']['age'][r[0]].append([r[1], r[2]])

        rs = c.execute('Select * from yearly_race')
        for r in rs:
            response['demo']['race'][r[0]].append([r[1], r[2]])

        rs = c.execute('Select * from yearly_gender')
        for r in rs:
            response['demo']['sex'][r[0]].append([r[1], r[2]])
        return jsonify(response)

# Demographic data

if __name__ == "__main__":
    app.run(debug=True)


