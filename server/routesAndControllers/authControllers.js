const { Users } = require("../models")

exports.getRegister = async(req, res, next) => {
  console.log("GET /auth/register")
  const listOfUsers = await Users.findAll()
  res.json(listOfUsers)
}

exports.postRegister = async(req, res, next) => {
  console.log("POST /auth/register")
  console.log(req.body)
  res.json({
    message: "Post register",
    error: "Duplicate"
  })
}
