# DAB - Resit
# Application Installation and Usage Instructions
To run this application, you'll need to have Node.js and MySQL installed in your machine.

Clone this repository to your local machine using the command:

git clone repository-url under the CODE tab or download the zip file.

Navigate to the terminal of the project window and install the required dependencies using:

npm install


Run the whole application using:

npm start

NOTE : Before you do 'npm start' please make sure you have created the database for this app.


# Environment Variables
ADMIN_USERNAME = "dabcaowner"
ADMIN_PASSWORD = "dabca1234"
DATABASE_NAME = "rentaldb"
DIALECT = "mysql"
DIALECTMODEL = "mysql2"
PORT = "3000"
HOST = "localhost"


# Additional Libraries/Packages
dotenv
express-session
sequelize mysql2
passport
passport-local


# NodeJS Version Used
v18.16.0


# DATABASE
The 'rentaldb' database can be created using the following SQL command:

CREATE DATABASE rentaldb;


# DATAINSERTS
- Roles table
    INSERT INTO Roles (id, roleName)
    VALUES (1, 'admin'),
           (2, 'customer');

- Users table
    INSERT INTO Users (id, fullName, username, password, roleId)
    VALUES (1, 'System admin', 'Admin', 'admin1234', 1),
           (2, 'User', 'User', 'user1234', 2),
           (3, 'User2', 'User 2', 'User1234', 2);

- Colours table
    INSERT INTO Colours (id, name)
    VALUES (1, 'Black'),
           (2, 'White'),
           (3, 'Blue'),
           (4, 'Silver'),
           (5, 'Green'),
           (6, 'Red'),
           (7, 'Tan');

- Types table
    INSERT INTO Types (id, name)
    VALUES (1, 'Hatchback'),
           (2, 'Sedan'),
           (3, 'SUV');

- Features table
    INSERT INTO Features (id, name)
    VALUES (1, 'Heated seats'),
           (2, 'Cruise control'),
           (3, 'Reverse camera'),
           (4, 'Lane-keep assist'),
           (5, 'Auto parking'),
           (6, 'Remote start'),
           (7, 'Quick charge'),
           (8, 'Heated steering wheel');

- Vehicles table
    INSERT INTO Vehicles (id, registrationNo, make, model, colourId, typeId, lastServiceDate, rented)
    VALUES 
    (1, '46875', 'Ford', 'Fiesta', 1, 1, '2023-05-12', TRUE),
    (2, '79845', 'VW', 'Golf', 2, 1, '2023-04-10', FALSE),
    (3, '75215', 'Toyota', 'Corolla', 2, 2, '2023-06-05', TRUE),
    (4, '52536', 'Ford', 'Taurus', 3, 2, '2023-11-28', FALSE),
    (5, '65643', 'Nissan', 'Ultima', 4, 2, '2023-04-10', FALSE),
    (6, '10235', 'Volvo', 'XC90', 2, 3, '2023-04-10', FALSE),
    (7, '54865', 'VW', 'ID.3', 5, 1, '2023-05-15', FALSE),
    (8, '98542', 'Ford', 'Fiesta', 6, 1, '2023-06-10', TRUE),
    (9, '45678', 'Ford', 'Focus', 3, 1, '2023-06-05', FALSE),
    (10, '45823', 'Toyota', 'Corolla', 2, 2, '2023-02-28', FALSE),
    (11, '65215', 'Audi', 'A3', 1, 2, '2023-03-12', FALSE),
    (12, '78947', 'Toyota', 'Land cruiser', 7, 3, '2023-01-31', FALSE);

- VehicleFeatures table
    INSERT INTO VehicleFeatures (vehicleId, featureId)
    VALUES 
        (1, 1),(1, 2),
        (2, 2),
        (3, 3),(3, 4),
        (4, 5),(4, 6),
        (5, 1),
        (6, 4),(6, 2),
        (7, 7),
        (8, 2),(8, 3),
        (9, 2),
        (10, 3),(10, 1),
        (11, 5),(11, 8),
        (12, 6);


# DATABASEACCESS

The database access can be created using the following SQL command:

CREATE USER 'dabcaowner'@'localhost' IDENTIFIED BY 'dabca1234';
GRANT ALL PRIVILEGES ON rentaldb.* TO 'dabcaowner'@'localhost';
FLUSH PRIVILEGES;


# Licenses
"CarRental.jpg" source: "https://www.vecteezy.com".