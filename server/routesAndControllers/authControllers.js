const { Users } = require("../models")

exports.getRegister = async(req, res, next) => {
  console.log("GET /auth/register")
  const listOfUsers = await Users.findAll()
  res.json(listOfUsers)
}
