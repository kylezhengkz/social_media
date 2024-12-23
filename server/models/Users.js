module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    }
  })

  return Users
}
