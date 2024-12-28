const { Posts } = require("../models")

function getDateStr() {
  let d = new Date()
  let yyyy = d.getFullYear()
  let mm = d.getMonth() + 1
  let dd = d.getDate()
  return `${yyyy}-${mm}-${dd}`
}

exports.createPost = async(req, res, next) => {
  try {
    console.log("POST /post/create")

    const { postTitle, postBody } = req.body
    console.log(req.body)
    console.log(postTitle)
    console.log(postBody)
    userId = req.session.userId
    if (!userId) {
      throw new Error("Attempted to create post without being authenticated")
    }
    console.log(userId)

    date = getDateStr()
    entry = {
      "postTitle":postTitle,
      "postBody":postBody,
      "UserId":userId,
      "createdAt":date,
      "updatedAt":date
    }
    await Posts.create(entry)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}
