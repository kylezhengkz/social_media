const express = require("express")
const router = express.Router()
const authControllers = require("./authControllers")

router.route("/register")
  .get(authControllers.getRegister)
  .post(authControllers.postRegister)

router.route("/login")
  .post(authControllers.postLogin)

router.route("/logout")
  .post(authControllers.postLogout)

module.exports = router
