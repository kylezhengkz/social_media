module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comments", {
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
