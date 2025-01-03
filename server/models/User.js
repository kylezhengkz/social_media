module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["username"]
      }
    ]
  })

  User.associate = (models) => {
    User.hasMany(models.Post, {
      onDelete: "cascade",
      foreignKey: "userId"
    })
  }

  User.associate = (models) => {
    User.hasMany(models.Like, {
      onDelete: "cascade",
      foreignKey: "userId"
    })
  }
  return User
}
