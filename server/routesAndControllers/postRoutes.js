const express = require("express")
const router = express.Router()
const postControllers = require("./postControllers")

router.route("/create")
  .post(postControllers.createPost)

module.exports = router