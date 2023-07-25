module.exports = (sequelize, Sequelize) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      registrationNo: Sequelize.STRING,
      make: Sequelize.STRING,
      model: Sequelize.STRING,
      colourId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Colours",
          key: "id",
        },
      },
      typeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Types",
          key: "id",
        },
      },
      lastServiceDate: Sequelize.DATE,
      rented: Sequelize.BOOLEAN,
    },
    {
      timestamps: false,
    }
  );
  Vehicle.associate = function (models) {
    Vehicle.hasMany(models.Rental, { foreignKey: "vehicleId" });
    Vehicle.belongsToMany(models.Feature, {
      through: "VehicleFeatures",
      timestamps: false,
    });
    Vehicle.belongsTo(models.Type, { foreignKey: "typeId" });
    Vehicle.belongsTo(models.Colour, { foreignKey: "colourId" });
  };
  return Vehicle;
};
