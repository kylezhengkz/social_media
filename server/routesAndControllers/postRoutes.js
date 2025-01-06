const express = require("express")
const router = express.Router()
const postControllers = require("./postControllers")

router.route("/create")
  .post(postControllers.createPost)

router.route("/edit/:id")
  .post(postControllers.editPost)

router.route("/delete/:id")
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

router.route("/:id/totalComments")
  .get(postControllers.totalComments)

router.route("/:id/addComment")
  .post(postControllers.addComment)

router.route("/:id/getComments")
  .get(postControllers.getComments)

router.route("/:id/getUserComments/:username")
  .get(postControllers.getUserComments)

router.route("/:id/getLikes")
  .get(postControllers.getLikes)

module.exports = router
