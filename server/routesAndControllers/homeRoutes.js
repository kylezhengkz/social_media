const express = require("express")
const router = express.Router()
const homeControllers = require("./homeControllers")

router.route("/")
  .get(homeControllers.getHome)

module.exports = router