# Sacramento Homeless Management Information System
-
A project to provide a user friendly and interactive dashboard for Sacramento County's Homeless Management Information System.
#### A homeless management information system (HMIS) is a database used to confidentially aggregate data on homeless populations served across the United States.
This repository contains the raw Sacramento County HMIS data, a jupyter notebook that loads the data into a PostgreSQl database, a flask API that then serves the data from the database, 
and finally a web based dashboard using HTML, CSS, and JavaScript to provide a way to interact with the data. The dashboard allows users to draw conclusions from the aggrigations 
visualized and calculated statistics displayed on the dashboard.  
-
Execution Instructions
-
  1) Create a local PostgreSQL database called "HMIS_db"
  2) Open DB_Load Jupyter Notebook, and add in your username and password in the second cell.
  3) Run all cells in DB_Load Jupyter notebook
  4) From the terminal, navigate to the "Flask-App" folder and run app.py by typing: "python app.py"
  5) Open a new terminal, navigate to the "Homeless-Dashboard" folder, and have python set up a local server by typing "python -m http.server"
  6) Open your browser then go to the url "http://localhost:8000/"
  7) Enjoy exploring the volume of program participants, the success rate of these programs, and the demographics of the individuals being served by the program!

Contents
-
#### Data:
  - DB_Load:
    - Jupyter Notebook that executes raw SQL to create PostgreSQL database tables
    - Formats then loads csv files into database 
    - Creates multiple views and new aggregate tables in database.  This uses the benefits of a relational database to extract valuable bits of information from the raw data.
    - Uses Pandas to manipulate some tables and do some calculations on the data before writing back into database 
  - CSV files containing all raw data that is used in this project
    - Data source can be found [here](https://github.com/code4sac/sacramento-county-homeless-hmis-data/tree/master/data)
#### Flask-App:
  - app.py:
    - Python file using Flask to create a local API that returns the aggregate tables as a JSON object 
#### Homeless-Dashboard:
  - index.html -> html file containing structure of dashboard 
  - static:
    - JS -> app.js, a JavaScript file that hits Flask api and dynamically builds the dashboard
    - CSS -> style.css,a Cascading Style Sheet that adds style and formatting to the dashboard

Authors
-
[Graham Penrose](https://www.linkedin.com/in/graham-penrose-ab6a7b188/)&[Scott Clark](https://www.linkedin.com/in/scott-d-clark/)
