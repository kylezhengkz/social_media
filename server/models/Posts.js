module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("Posts", {
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
  }, {
    indexes: [
      {
        unique: false,
        fields: ["userId"]
      }
    ]
  })
  return Post
}
