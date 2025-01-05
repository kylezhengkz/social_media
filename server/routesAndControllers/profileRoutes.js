const express = require("express")
const router = express.Router()
const postControllers = require("./profileControllers")

router.route("/viewMyPosts")
  .get(postControllers.viewMyPosts)

router.route("/viewPostsILiked")
  .get(postControllers.viewPostsILiked)

router.route("/viewMyComments")
  .get(postControllers.viewMyComments)

router.route("/queryProfile/:username")
  .get(postControllers.queryProfile)

module.exports = router