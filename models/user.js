module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      fullName: Sequelize.STRING,
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      roleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Roles",
          key: "id",
        },
        defaultValue: 2,
      },
    },
    {
      timestamps: false,
    }
  );

  User.associate = function (models) {
    User.belongsTo(models.Role, { foreignKey: "roleId" });
    User.hasMany(models.Rental, { foreignKey: "userId" });
  };

  return User;
};
