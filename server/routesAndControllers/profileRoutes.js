const express = require("express")
const router = express.Router()
const postControllers = require("./profileControllers")

router.route("/viewMyPosts")
  .get(postControllers.viewMyPosts)

router.route("/viewPostsILiked")
  .get(postControllers.viewPostsILiked)


router.route("/viewMyComments")
  .get(postControllers.viewMyComments)


router.route("/:userId/viewPosts")
  .get(postControllers.viewMyPosts)

module.exports = router