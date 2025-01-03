const axios = require('axios')
const { Post } = require("../models")
exports.getHome = async(req, res) => {
  console.log("GET /home")
  let posts = await Post.findAll()
  posts = JSON.parse(JSON.stringify(posts))
  for (let i = 0; i < posts.length; i++) {
    totalLikes = await axios.get(`http://localhost:3000/post/${posts[i].id}/totalLikes`)
    posts[i]["likes"] = totalLikes.data
  }
  res.json(posts)
}
