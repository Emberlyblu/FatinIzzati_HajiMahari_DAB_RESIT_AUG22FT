const Sequelize = require("sequelize");
const path = require("path");
require("dotenv").config();

const connection = {
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST,
  dialect: process.env.DIALECT,
  dialectmodel: process.env.DIALECTMODEL,
};

const sequelize = new Sequelize(connection);
const db = {};

db.sequelize = sequelize;

const modelFiles = [
  "Role",
  "User",
  "Rental",
  "Colour",
  "Feature",
  "Type",
  "Vehicle",
];

modelFiles.forEach((file) => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
