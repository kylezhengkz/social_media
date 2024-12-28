module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    text: {
      type: DataTypes.STRING(2200),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    }
  })

  return Posts
}
