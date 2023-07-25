module.exports = (sequelize, Sequelize) => {
  const Feature = sequelize.define(
    "Feature",
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: Sequelize.STRING,
    },
    {
      timestamps: false,
    }
  );
  Feature.associate = function (models) {
    Feature.belongsToMany(models.Vehicle, {
      through: "VehicleFeatures",
      timestamps: false,
    });
  };
  return Feature;
};
