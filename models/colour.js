module.exports = (sequelize, Sequelize) => {
  const Colour = sequelize.define(
    "Colour",
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: Sequelize.STRING,
    },
    {
      timestamps: false,
    }
  );

  Colour.associate = function (models) {
    Colour.hasMany(models.Vehicle, { foreignKey: "colourId" });
  };

  return Colour;
};
