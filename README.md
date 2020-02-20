# Sacramento Homeless Management Information System
##### A project to provide a user friendly and interactive dashboard with data from Sacramento County's Homeless Management Information System
![top_of_dash](https://github.com/scottinsactown/Homeless-Services-in-Sacramento/blob/master/images/HMIS_dash_top.JPG)
###### A homeless management information system (HMIS) is a database used to aggregate data on homeless populations served across the United States. This repository contains the source Sacramento County HMIS data, a Jupyter Notebook that loads the data into a PostgreSQL database, a flask API that then serves the data from the database, and finally a web based dashboard using HTML, CSS, and JavaScript. The dashboard includes interactive charts that allows users to explore homeless services program volumes, outcomes, and participant demographics.
![mid_dash](https://github.com/scottinsactown/Homeless-Services-in-Sacramento/blob/master/images/HMIS_dash_middle.JPG)

Execution Instructions
-
  1) Create a local PostgreSQL database named "HMIS_db".
  2) Open DB_Load Jupyter Notebook and add in your PostgreSQL `username` and `password` in the second cell.
  3) Run all cells in DB_Load Jupyter notebook.
  4) From the terminal, navigate to the "Flask-App" folder and run app.py by typing: `python app.py`.
  5) Open a new terminal, navigate to the "Homeless-Dashboard" folder, and have python set up a local server by typing `python -m http.server`.
  6) Open your browser then go to the url `http://localhost:8000/`.
  
![bottom_dash](https://github.com/scottinsactown/Homeless-Services-in-Sacramento/blob/master/images/HMIS_dash_bottom.JPG)

Contents
-
#### Data (folder):
- DB_Load:
    - Jupyter Notebook that executes raw SQL to create PostgreSQL database tables.
    - Formats then loads csv files into database.
    - Creates multiple views and new aggregate tables in database.  This leverages the benefits of a relational database to extract valuable information from the raw data.
    - Uses Pandas to manipulate some tables and do some calculations on the data before writing back into database.
- CSV files containing all raw data that is used in this project.
    - Data source can be found [here](https://github.com/code4sac/sacramento-county-homeless-hmis-data/tree/master/data). An additional spreadsheet with exit destinations was created to facilitate analysis.
#### Flask-App (folder):
- app.py:
    - Python file using Flask to create a local API that returns the aggregate tables as a JSON object. 
#### Homeless-Dashboard (folder):
- index.html -> html file containing structure of dashboard. 
- static:
    - JS -> app.js -> a JavaScript file that hits Flask API and dynamically builds the dashboard utilizing the Highcharts library.
    - CSS -> style.css -> a Cascading Style Sheet that adds style and formatting to the dashboard.

Authors
-
[Graham Penrose](https://www.linkedin.com/in/graham-penrose-ab6a7b188/) & [Scott Clark](https://www.linkedin.com/in/scott-d-clark/)
