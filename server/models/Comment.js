module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING(2200),
      allowNull: false
    }
   }, {
    indexes: [
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
