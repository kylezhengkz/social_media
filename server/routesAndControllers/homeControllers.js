const { Posts } = require("../models")
exports.getHome = async(req, res) => {
  console.log("GET /home")
  const posts = await Posts.findAll()
  res.json(posts)
}
