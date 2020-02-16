# Flask app for HMIS

from flask import Flask, jsonify
from flask_cors import CORS 
from sqlalchemy import create_engine
from sqlalchemy import create_engine
from config import username, password


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
                                '2019':[],
                            None:[]}},
                    'outcomes':{'yearly':{'exit_ph':{},
                                    'exit_all':{},
                                    'average':{},
                                    'percent_ph':{}
                                    },
                        'monthly':{'exit_ph':{},
                                    'exit_all':{},
                                    'percent_ph':{}}},
                'demo':{'age':{'2015':[],
                                '2016':[],
                                '2017':[],
                                '2018':[],
                                '2019':[],
                            None:[]},
                    'race':{'2015':[],
                                '2016':[],
                                '2017':[],
                                '2018':[],
                                '2019':[],
                            None: []},
                    'sex':{'2015':[],
                                '2016':[],
                                '2017':[],
                                '2018':[],
                                '2019':[],
                            None:[]}}
                    } 
                    
    with engine.connect() as c:
        rs = c.execute('Select * from yearly_flow')
        for r in rs:
            response['flow']['yearly']['in'][r[3]] = r[0]
            response['flow']['yearly']['out'][r[3]] = r[1]
            response['outcomes']['yearly']['exit_all'][r[3]] = r[1]
            response['outcomes']['yearly']['exit_ph'][r[3]] = r[4]
            response['outcomes']['yearly']['average'][r[3]] = int(r[5])
            response['flow']['yearly']['active'][r[3]] = r[2]
            response['outcomes']['yearly']['percent_ph'][r[3]]=int(r[6])
        rs = c.execute('Select * from monthly_flow')
        for r in rs:
            response['flow']['monthly']['in'][r[3]] = r[0]
            response['flow']['monthly']['active'][r[3]] = r[2]
            response['flow']['monthly']['out'][r[3]] = r[1]
            response['outcomes']['monthly']['exit_all'][r[3]] = r[1]
            response['outcomes']['monthly']['exit_ph'][r[3]] = r[4]
            response['outcomes']['monthly']['percent_ph'][r[3]]=int(r[5])
        rs = c.execute('Select * from demographics')
        for r in rs:
            response['demo']['age'][r[12]].append([r[7],r[8],r[9],r[10],r[11]])
            response['demo']['sex'][r[5]].append([r[3],r[4]])
            response['demo']['race'][r[2]].append([r[0],r[1]])
            response['flow']['top_5'][r[15]].append([r[13],r[14]])
            
    del response['demo']['age'][None]
    del response['demo']['sex'][None]
    del response['demo']['race'][None]
    del response['flow']['top_5'][None]
    
    return jsonify(response)

# Demographic data

if __name__ == "__main__":
    app.run(debug=True)


