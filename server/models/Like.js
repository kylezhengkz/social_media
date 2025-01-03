module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("Like", {
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
   },
   {
    indexes: [
      {
        unique: true,
        fields: ["postId", "userId"]
      },
      {
        unique: false,
        fields: ["postId"]
      },
      {
        unique: false,
        fields: ["userId"]
      }
    ]
  })

  return Like
}
