module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    postTitle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    postBody: {
      type: DataTypes.STRING(2200),
      allowNull: false
    },
    votes: {
      type: JSON,
      defaultValue: {likes: [], dislikes: []},
      allowNull: false
    }
   })

  return Posts
}
