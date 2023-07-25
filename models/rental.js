module.exports = (sequelize, Sequelize) => {
  const Rental = sequelize.define(
    "Rental",
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      rentalDate: Sequelize.DATE,
      returnDate: Sequelize.DATE,
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      vehicleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Vehicles",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
    }
  );
  Rental.associate = function (models) {
    Rental.belongsTo(models.User, { foreignKey: "userId" });
    Rental.belongsTo(models.Vehicle, { foreignKey: "vehicleId" });
  };

  return Rental;
};
