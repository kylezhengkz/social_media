const { Post } = require("../models")
const { Like } = require("../models")
const { Comment } = require("../models")

exports.viewMyPosts = async(req, res, next) => {
  try {
    console.log("GET /profile/viewMyPosts")
    userId = req.session.userId
    const findPosts = await Post.findAll({
      where: {
        userId: userId
      }
    })
    res.json(findPosts)
  } catch (err) {
    next(err)
  }
}

exports.viewPostsILiked = async(req, res, next) => {
  try {
    console.log("GET /profile/viewPostsILiked")
    userId = req.session.userId
    const findPostsILiked = await Like.findAll({
      where: {
        userId: userId
      }
    })
    res.json(findPostsILiked)
  } catch (err) {
    next(err)
  }
}

exports.viewMyComments = async(req, res, next) => {
  try {
    console.log("GET /profile/viewMyComments")
    userId = req.session.userId
    const findComments = await Comment.findAll({
      where: {
        userId: userId
      }
    })
    res.json(findComments)
  } catch (err) {
    next(err)
  }
}

exports.viewUserPosts = async(req, res, next) => {
  try {
    console.log("GET /profile/:userId/viewPosts")
    userId = req.params.userId
    const findPosts = await Post.findAll({
      where: {
        userId: userId
      }
    })
    res.json(findPosts)
  } catch (err) {
    next(err)
  }
}