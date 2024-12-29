const express = require("express")
const router = express.Router()
const homeControllers = require("./homeControllers")

router.route("/browse")
  .get(homeControllers.getHome)

module.exports = router