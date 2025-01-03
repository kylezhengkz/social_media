module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Post", {
    postTitle: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    postBody: {
      type: DataTypes.STRING(2200),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  })

  Post.associate = (models) => {
    Post.hasMany(models.Like, {
      onDelete: "cascade",
      foreignKey: "postId"
    })
  }
  return Post
}
