const { Post } = require("../models")
const { Like } = require("../models")
const { Comment } = require("../models")
const { User } = require("../models")
const { Op } = require('sequelize')

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

exports.queryProfile = async(req, res, next) => {
  try {
    console.log("GET /profile/queryProfile/:username")
    username = req.params.username
    const user = await User.findOne({
      where: {
        username: username
      }
    })

    if (!user) {
      return res.json({error: "dummyError"})
    }

    const findPosts = await Post.findAll({
      where: {
        userId: user.id
      }
    })

    const findLikedPosts = await Like.findAll({
      where: {
        userId: user.id
      }
    })

    const findComments = await Comment.findAll({
      where: {
        userId: user.id
      }
    })

    res.json({"posts": findPosts, "likedPosts": findLikedPosts, "comments": findComments})
  } catch (err) {
    next(err)
  }
}

exports.viewUserPosts = async(req, res, next) => {
  try {
    console.log("GET /profile/viewUserPosts/:username")
    username = req.params.username

    const user = await User.findOne({
      where: {
        username: username
      }
    })

    if (!user) {
      throw new Error("Attempted to browse from a user that doesn't exist")
    }

    const findPosts = await Post.findAll({
      where: {
        userId: user.id
      }
    })
    res.json(findPosts)
  } catch (err) {
    next(err)
  }
}

exports.viewUserLikedPosts = async(req, res, next) => {
  try {
    console.log("GET /profile/viewUserLikedPosts/:username")
    username = req.params.username

    const user = await User.findOne({
      where: {
        username: username
      }
    })

    if (!user) {
      throw new Error("Attempted to browse from a user that doesn't exist")
    }

    const findLikes = await Like.findAll({
      where: {
        userId: user.id
      }
    })

    let postIds = []
    // cannot like a post more than once so it should be unique
    for (const like of findLikes) {
      postIds.push({"id": like["postId"]})
    }

    const findLikedPosts = await Post.findAll({
      where: {
        [Op.or]: postIds
      }
    })

    res.json(findLikedPosts)
  } catch (err) {
    next(err)
  }
}

exports.viewUserCommentedPosts = async(req, res, next) => {
  try {
    console.log("GET /profile/viewUserCommentedPosts/:username")
    username = req.params.username

    const user = await User.findOne({
      where: {
        username: username
      }
    })

    if (!user) {
      throw new Error("Attempted to browse from a user that doesn't exist")
    }

    const findComments = await Comment.findAll({
      where: {
        userId: user.id
      }
    })

    let postIds = new Set()
    for (const comment of findComments) {
      postIds.add(comment["postId"])
    }
    let postIdsJson = []
    for (const postId of postIds) {
      postIdsJson.push({"id": postId})
    }

    console.log(postIdsJson)

    const findCommentedPosts = await Post.findAll({
      where: {
        [Op.or]: postIdsJson
      }
    })

    res.json(findCommentedPosts)
  } catch (err) {
    next(err)
  }
}