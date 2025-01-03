const express = require("express")
const router = express.Router()
const postControllers = require("./postControllers")

router.route("/create")
  .post(postControllers.createPost)

router.route("/delete")
  .post(postControllers.deletePost)

router.route("/:id")
  .get(postControllers.getPost)

router.route("/:id/totalLikes")
  .get(postControllers.totalLikes)

router.route("/:id/didUserLikePost")
  .get(postControllers.didUserLikePost)

router.route("/:id/likePost")
  .post(postControllers.likePost)

router.route("/:id/unlikePost")
  .post(postControllers.unlikePost)

router.route("/:id/totalComment")
  .get(postControllers.totalComment)

router.route("/:id/addComment")
  .post(postControllers.addComment)

module.exports = router
