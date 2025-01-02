const { Post } = require("../models")
var Sequelize = require("sequelize")

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
      "userId":userId,
      "createdAt":date,
      "updatedAt":date
    }
    await Post.create(entry)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

exports.getPost = async(req, res, next) => {
  try {
    console.log("GET /post/:id")
    id = req.params.id
    const findPost = await Post.findOne({
      where: {
        id: id
      }
    })
    console.log(findPost)
    res.send(findPost)
  } catch (err) {
    next(err)
  }
}

async function addVote(id, userIdJson) {
  await Post.update(
    {
      votes: Sequelize.fn("JSON_MERGE_PRESERVE", 
        Sequelize.col("votes"), 
        Sequelize.literal(`'${JSON.stringify(userIdJson)}'`)
      ),
    },
    { where: { id: id } },
  )
}

exports.likePost = async(req, res, next) => {
  try {
    console.log("POST /post/:id/likePost/:userId")
    id = req.params.id
    userId = req.params.userId
    console.log(id)
    console.log(userId)
    let findPost = await Post.findOne({ // set back to const later
      where: {
        id: id
      }
    })

    const findUser = await Post.findOne({
      where: {
        userId: userId
      }
    })
    if (findUser) {
      console.log("User already liked the post")
      throw new Error("User already liked the post")
    }

    await addVote(id, {"likes": [userId]})

    // debugging purposes
    findPost = await Post.findOne({
      where: {
        id: id
      }
    })

    console.log(findPost.votes)
    res.send(findPost.votes)
  } catch (err) {
    next(err)
  }
}
