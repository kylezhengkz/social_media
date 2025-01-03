const express = require("express")
const router = express.Router()
const postControllers = require("./postControllers")

router.route("/create")
  .post(postControllers.createPost)

router.route("/:id")
  .get(postControllers.getPost)

router.route("/:id/didUserLikePost")
  .get(postControllers.didUserLikePost)

router.route("/:id/likePost")
  .post(postControllers.likePost)

router.route("/:id/unlikePost")
  .post(postControllers.unlikePost)

module.exports = router
