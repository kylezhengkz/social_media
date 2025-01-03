module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
   }, {
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
   }
  )

  return Comment
}
