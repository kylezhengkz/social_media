const { Post } = require("../models")
exports.getHome = async(req, res) => {
  console.log("GET /home")
  const posts = await Post.findAll()
  res.json(posts)
}
