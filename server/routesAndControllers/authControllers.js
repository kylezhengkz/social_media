const { User } = require("../models")
const bcrypt = require('bcrypt')

exports.getCheckAuth = async(req, res, next) => {
  console.log("GET /auth/checkAuth")
  console.log(`Request session ID: ${req.sessionID}`)
  console.log(req.session)
  if (req.session.userId) {
    console.log("User authenticated")
    res.json({isAuth: true})
  } else {
    console.log("User not authenticated")
    res.json({isAuth: false})
  }
}

exports.getRegister = async(req, res, next) => {
  console.log("GET /auth/register")
  console.log(`Request session ID: ${req.sessionID}`)
  console.log(req.session)
  try {
    const listOfUser = await User.findAll()
    res.json(listOfUser)
  } catch (err) {
    next(err)
  }
}

function getDateStr() {
  let d = new Date()
  let yyyy = d.getFullYear()
  let mm = d.getMonth() + 1
  let dd = d.getDate()
  return `${yyyy}-${mm}-${dd}`
}

exports.postRegister = async(req, res, next) => {
  console.log("POST /auth/register")

  try {
    const { username, password } = req.body
    console.log(username)
    console.log(password)

    const findUsername = await User.findOne({
      where: {
        username: username
      }
    })
    console.log(findUsername)
    if (findUsername) { // username exists
      console.log("Duplicate username")
      return res.json({
        duplicateUsername: true
      })
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword)
    console.log(hashedPassword.length)

    date = getDateStr()

    entry = {
      "username":username,
      "hashedPassword":hashedPassword,
      "createdAt":date,
      "updatedAt":date
    }
    console.log(entry)
    await User.create(entry)

    res.json({
      duplicateUsername: false
    })
  } catch (err) {
    next(err)
  }
}

exports.postLogin = async(req, res, next) => {
  console.log("POST /auth/login")

  try {
    const { username, password } = req.body
    console.log(username)
    console.log(password)

    const findUsername = await User.findOne({
      where: {
        username: username
      }
    })

    if (!findUsername) { // username does not exist
      console.log("Username does not exist")
      return res.json({
        invalidUsername: true,
        invalidPassword: false
      })
    }

    const isMatch = await bcrypt.compare(password, findUsername.hashedPassword)

    if (!isMatch) {
      console.log("Invalid password")
      return res.json({
        invalidUsername: false,
        invalidPassword: true
      })
    }

    req.session.userId = findUsername.id
    req.session.save((err) => {
      if (err) {
        console.log("Session save error")
        return next(err)
      } else {
        console.log("Session saved properly")
        console.log(`Request session ID: ${req.sessionID}`)
        console.log(req.session)
        res.json({
          invalidUsername: false,
          invalidPassword: false
        })
      }
    })
  } catch (err) {
    next(err)
  }
}

exports.postLogout = async(req, res, next) => {
  console.log("POST /auth/logout")
  console.log(`Request session ID: ${req.sessionID}`)
  console.log(req.session)
  req.session.destroy((err) => {
    if (err) {
      return next(err)
    }
  })
  res.send("Logout")
}
