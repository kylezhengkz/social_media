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
   })

  return Comment
}
