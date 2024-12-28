module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING(60),
      allowNull: false
    }
  })

  Users.associate = (models) => {
    Users.hasMany(models.Posts, {
      onDelete: "cascade"
    })
  }
  return Users
}
