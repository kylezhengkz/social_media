const express = require("express")
const router = express.Router()
const authControllers = require("./authControllers")

router.route("/register")
  .get(authControllers.getRegister)
  .post(authControllers.postRegister)

module.exports = router