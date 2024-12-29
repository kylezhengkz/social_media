const express = require("express")
const router = express.Router()
const postControllers = require("./postControllers")

router.route("/create")
  .post(postControllers.createPost)

router.route("/:id")
  .get(postControllers.getPost)

router.route("/:id/likePost/:userId")
  .post(postControllers.likePost)

// router.route("/:id/unlikePost/:userId")
//   .post(postControllers.unlikePost)

// router.route("/:id/dislikePost/:userId")
//   .post(postControllers.dislikePost)

// router.route("/:id/undislikePost/:userId")
//   .post(postControllers.undislikePost)

module.exports = router
