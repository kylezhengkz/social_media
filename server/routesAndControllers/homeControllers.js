const axios = require('axios')
axios.defaults.withCredentials = true

const { Post } = require("../models")
exports.getHome = async(req, res) => {
  console.log("GET /home/browse")
  let posts = await Post.findAll()
  posts = JSON.parse(JSON.stringify(posts))
  console.log(`HERE: ${JSON.stringify(req.session)}`)
  for (let i = 0; i < posts.length; i++) {
    const totalLikes = await axios.get(`http://localhost:3000/post/${posts[i].id}/totalLikes`)
    const totalComments = await axios.get(`http://localhost:3000/post/${posts[i].id}/totalComment`)
    posts[i]["likes"] = totalLikes.data
    posts[i]["comments"] = totalComments.data
  }
  res.json(posts)
}
