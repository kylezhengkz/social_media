const { Post } = require("../models")
const { Like } = require("../models")

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

exports.totalLikes = async(req, res, next) => {
  try {
    console.log("GET /post/:id/totalLikes")
    id = req.params.id
    console.log(id)
    
    const allLikes = await Like.findAll({
      where: {
        postId: id
      }
    })

    totalLikes = Object.keys(allLikes).length
    console.log(`Total likes: ${totalLikes}`)
    res.send(`${totalLikes}`)
  } catch (err) {
    next(err)
  }
}

exports.didUserLikePost = async(req, res, next) => {
  try {
    console.log("GET /post/:id/didUserLikePost")
    id = req.params.id
    userId = req.session.userId
    console.log(id)
    console.log(userId)
    console.log(req.session)
    console.log(req.sessionID)
    
    const findUserPostLike = await Like.findOne({
      where: {
        userId: userId,
        postId: id
      }
    })

    userLikedPost = false

    if (findUserPostLike) {
      console.log("User already liked the post")
      userLikedPost = true
    }
    res.send(userLikedPost)
  } catch (err) {
    next(err)
  }
}

exports.likePost = async(req, res, next) => {
  try {
    console.log("POST /post/:id/likePost")
    id = req.params.id
    userId = req.session.userId
    console.log(id)
    console.log(userId)
    
    const findUserPostLike = await Like.findOne({
      where: {
        userId: userId,
        postId: id
      }
    })

    if (findUserPostLike) {
      console.log("User already liked the post")
      throw new Error("User already liked the post")
    }

    entry = {
      "postId":id,
      "userId":userId
    }

    await Like.create(entry)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

exports.unlikePost = async(req, res, next) => {
  try {
    console.log("POST /post/:id/unlikePost")
    id = req.params.id
    userId = req.session.userId
    console.log(id)
    console.log(userId)
    
    const findUserPostLike = await Like.findOne({
      where: {
        userId: userId,
        postId: id
      }
    })

    if (!findUserPostLike) {
      console.log("User never liked the post to begin with")
      throw new Error("User never liked the post to begin with")
    }
    await findUserPostLike.destroy()
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}
