const { Post } = require("../models")
const { Like } = require("../models")
const { Comment } = require("../models")
const { User } = require("../models")

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

exports.editPost = async(req, res, next) => {
  try {
    console.log("POST /post/edit/:id")
    userId = req.session.userId
    if (!userId) {
      throw new Error("Attempted to edit post without being authenticated")
    }

    const { newTitle, newBody } = req.body
    console.log(newTitle)
    console.log(newBody)
    id = req.params.id
    console.log(id)

    await Post.update(
      { postTitle: newTitle, postBody: newBody },
      {
        where: {
          id: id,
          userId: userId
        },
      },
    );
        
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

exports.deletePost = async(req, res, next) => {
  try {
    console.log("POST /post/delete/:id")
    userId = req.session.userId
    if (!userId) {
      throw new Error("Attempted to delete post without being authenticated")
    }
    console.log(userId)

    id = req.params.id
    const findPost = await Post.findOne({
      where: {
        id: id,
        userId: userId
      }
    })

    if (!findPost) {
      throw new Error("Attempted to delete a post that doesn't exist")
    }

    await findPost.destroy()
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

exports.totalComments = async(req, res, next) => {
  try {
    console.log("GET /post/:id/totalComments")
    id = req.params.id
    console.log(id)
    
    const allComments = await Comment.findAll({
      where: {
        postId: id
      }
    })

    totalComments = Object.keys(allComments).length
    console.log(`Total comments: ${totalComments}`)
    res.send(`${totalComments}`)
  } catch (err) {
    next(err)
  }
}

exports.addComment = async(req, res, next) => {
  try {
    console.log("POST /post/:id/addComment")

    const { comment } = req.body
    id = req.params.id
    userId = req.session.userId
    console.log(id)
    console.log(userId)
    console.log(comment)

    entry = {
      "postId":id,
      "userId":userId,
      "comment":comment
    }

    await Comment.create(entry)
    res.sendStatus(200)
  } catch (err) {
    next(err)
  }
}

exports.getComments = async(req, res, next) => {
  try {
    console.log("POST /post/:id/getComments")
    id = req.params.id
    const allComments = await Comment.findAll({
      where: {
        postId: id
      }
    })
    console.log(JSON.stringify(allComments))
    res.json(allComments)
  } catch (err) {
    next(err)
  }
}

exports.getUserComments = async(req, res, next) => {
  try {
    console.log("GET /post/:id/getComments/:username")
    id = req.params.id
    username = req.params.username
    console.log(username)
    const user = await User.findOne({
      where: {
        username: username
      }
    })
    const allComments = await Comment.findAll({
      where: {
        postId: id,
        userId: user.id
      }
    })
    console.log(JSON.stringify(allComments))
    res.json(allComments)
  } catch (err) {
    next(err)
  }
}

exports.getLikes = async(req, res, next) => {
  try {
    console.log("POST /post/:id/getLikes")
    id = req.params.id
    const allLikes = await Like.findAll({
      where: {
        postId: id
      }
    })
    console.log(JSON.stringify(allLikes))
    res.json(allLikes)
  } catch (err) {
    next(err)
  }
}
