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
    # response = {'flow':{'yearly':{'in':{},
    #                          'out':{},
    #                          'active':{}},
    #                'monthly':{'in':{},
    #                          'out':{},
    #                          'active':{}},
    #                'top_5':{'2015':[],
    #                         '2016':[],
    #                         '2017':[],
    #                         '2018':[],
    #                         '2019':[]}},
    #              'outcomes':{'yearly':{'exit_ph':{},
    #                              'exit_all':{}
    #                              ,'average':{}
    #                              },
    #                    'monthly':{'exit_ph':{},
    #                             'exit_all':{}}},
    #         'demo':{'age':{'2015':[],
    #                         '2016':[],
    #                         '2017':[],
    #                         '2018':[],
    #                         '2019':[]},
    #                'race':{'2015':[],
    #                         '2016':[],
    #                         '2017':[],
    #                         '2018':[],
    #                         '2019':[]},
    #                'sex':{'2015':[],
    #                         '2016':[],
    #                         '2017':[],
    #                         '2018':[],
    #                         '2019':[]}}
    #             }

    # with engine.connect() as c:
    #     rs = c.execute('Select * from yearly_flow')
    #     for r in rs:
    #         response['flow']['yearly']['in'][r[3]] = r[0]
    #         response['flow']['yearly']['out'][r[3]] = r[1]
    #         response['outcomes']['yearly']['exit_all'][r[3]] = r[1]
    #         response['outcomes']['yearly']['exit_ph'][r[3]] = r[4]
    #         response['outcomes']['yearly']['average'][r[3]] = int(r[5])
    #         response['flow']['yearly']['active'][r[3]] = r[2]
    #     rs = c.execute('Select * from monthly_flow')
    #     for r in rs:
    #         response['flow']['monthly']['in'][r[3]] = r[0]
    #         response['flow']['monthly']['active'][r[3]] = r[2]
    #         response['flow']['monthly']['out'][r[3]] = r[1]
    #         response['outcomes']['monthly']['exit_all'][r[3]] = r[1]
    #         response['outcomes']['monthly']['exit_ph'][r[3]] = r[4]

    #     rs = c.execute('Select * from top_5_programs')
    #     for r in rs:
    #         response['flow']['top_5'][r[0]].append([r[1], r[2]])
    #     rs = c.execute('Select * from yearly_age')
    #     for r in rs:
    #         response['demo']['age'][r[0]].append([r[1], r[2]])

    #     rs = c.execute('Select * from yearly_race')
    #     for r in rs:
    #         response['demo']['race'][r[0]].append([r[1], r[2]])

    #     rs = c.execute('Select * from yearly_gender')
    #     for r in rs:
    #         response['demo']['sex'][r[0]].append([r[1], r[2]])

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
                                    'exit_all':{}
                                    ,'average':{}
                                    },
                        'monthly':{'exit_ph':{},
                                    'exit_all':{}}},
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
        rs = c.execute('Select * from monthly_flow')
        for r in rs:
            response['flow']['monthly']['in'][r[3]] = r[0]
            response['flow']['monthly']['active'][r[3]] = r[2]
            response['flow']['monthly']['out'][r[3]] = r[1]
            response['outcomes']['monthly']['exit_all'][r[3]] = r[1]
            response['outcomes']['monthly']['exit_ph'][r[3]] = r[4]
        rs = c.execute('Select * from demographics')
        for r in rs:
            response['demo']['age'][r[8]].append([r[6],r[7]])
            response['demo']['sex'][r[5]].append([r[3],r[4]])
            response['demo']['race'][r[2]].append([r[0],r[1]])
            response['flow']['top_5'][r[11]].append([r[9],r[10]])
            
    del response['demo']['age'][None]
    del response['demo']['sex'][None]
    del response['demo']['race'][None]
    del response['flow']['top_5'][None]
    
    return jsonify(response)

# Demographic data

if __name__ == "__main__":
    app.run(debug=True)


