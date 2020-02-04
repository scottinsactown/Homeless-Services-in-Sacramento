-- Create new tables
DROP TABLE Clients;

CREATE TABLE Clients(
	"Race" varchar,
	"Ethnicity" varchar,
	"Gender" varchar,
	"Vet_Status" varchar,
	"Vet_Discharge_Status" varchar,
	"Created_Date" date,
	"Updated_Date" date,
	"Birth_Date" date,
	"Client_Id" bigint PRIMARY KEY
);

DROP TABLE Assessment;

CREATE TABLE Assessment (
	"ignore" int,
	"Client_Id" bigint,
	"Assessment_Id" bigint PRIMARY KEY,
	"Assessment_Type" varchar,
	"Assessment_Score" int,
	"Assessment_Date" date,
	FOREIGN KEY ("Client_Id") REFERENCES Clients("Client_Id")
);


DROP TABLE Programs;

CREATE TABLE Programs (
	"ignore" int,
	"Program_Id" int PRIMARY KEY,
	"Agency_Id" int,
	"Program_Name" varchar, 
	"Program_Start" date,
	"Program_End" date,
	"Continuum" int,
	"Project_Type" varchar,
	"ignore_API" varchar,
	"ignore_ARP" int,
	"ignore_TM" varchar,
	"Target_Pop" varchar,
	"ignore_VSP" int,
	"Housing_Type" varchar,
	"Added_Date" date,
	"Updated_Date" date
);

DROP TABLE Enrollment;

CREATE TABLE Enrollment (
	"ignore" int,
	"Client_Id" bigint,
	"Enrollment_Id" bigint PRIMARY KEY,
	"Household_Id" bigint,
	"Program_Id" int,
	"Added_Date" date,
	"Housing_Status" varchar,
	"LOS_Prior" varchar,
	"blank Entry Screen Times Homeless in the Past Three Years" varchar,
	"blank Entry Screen Total Months Homeless in Past Three Years" varchar,
	"ignore Entry Screen Client Became Enrolled in PATH (Yes / No)" varchar,
	"ignore blank Entry Screen Reason not Enrolled" varchar,
	"ignore blank Entry Screen City" varchar,
	"ignore blank Entry Screen State" varchar,
	"Zip" int,
	"Chronic_Homeless" varchar,
	"Prior_Residence" varchar,
	"Last_Grade_Completed" varchar,
-- 	FOREIGN KEY ("Program_Id") REFERENCES Programs("Program_Id"), -program table missing programs
	FOREIGN KEY ("Client_Id") REFERENCES Clients("Client_Id")
);

DROP TABLE Exit_Screen; 

CREATE TABLE Exit_Screen (
"Client_ID" bigint,
"Enrollment_Id" bigint,
"Exit_Destination" varchar,
"Exit_Reason" varchar, 
"Exit_Date" date,
FOREIGN KEY ("Client_Id") REFERENCES Clients("Client_Id"),
FOREIGN KEY ("Enrollment_Id") REFERENCES Enrollment("Enrollment_Id")
);

-- After data loaded drop blank and "not important" columns
ALTER TABLE Assessment
DROP COLUMN "ignore";

ALTER TABLE Programs
DROP COLUMN "ignore",
DROP COLUMN "ignore_API",
DROP COLUMN "ignore_ARP",
DROP COLUMN "ignore_TM",
DROP COLUMN "ignore_VSP";

ALTER TABLE Enrollment
DROP COLUMN "ignore",
DROP COLUMN "blank Entry Screen Times Homeless in the Past Three Years",
DROP COLUMN "blank Entry Screen Total Months Homeless in Past Three Years",
DROP COLUMN "ignore Entry Screen Client Became Enrolled in PATH (Yes / No)",
DROP COLUMN "ignore blank Entry Screen Reason not Enrolled",
DROP COLUMN "ignore blank Entry Screen City",
DROP COLUMN "ignore blank Entry Screen State";

ALTER TABLE Exit_Screen
ADD COLUMN ES_Id bigserial PRIMARY KEY;

SELECT * FROM Assessment;
SELECT * FROM Clients;
SELECT * FROM Programs;
SELECT * FROM Enrollment;
SELECT * FROM Exit_Screen;
