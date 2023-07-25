module.exports = (sequelize, Sequelize) => {
  const Type = sequelize.define(
    "Type",
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: Sequelize.STRING,
    },
    {
      timestamps: false,
    }
  );

  Type.associate = function (models) {
    Type.hasMany(models.Vehicle, { foreignKey: "typeId" });
  };

  return Type;
};
