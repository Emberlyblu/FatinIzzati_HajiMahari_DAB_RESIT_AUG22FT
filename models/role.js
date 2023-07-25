module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "Role",
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      roleName: Sequelize.STRING,
    },
    {
      timestamps: false,
    }
  );
  return Role;
};
