const { Posts } = require("../models")
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

exports.getPost = async(req, res, next) => {
  try {
    console.log("GET /post/:id")
    id = req.params.id
    const findPost = await Posts.findOne({
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

function updateVotes(id, voteJson) {
  Posts.update(
    {
      votes: Sequelize.fn("JSON_MERGE_PRESERVE", 
        Sequelize.col("votes"), 
        Sequelize.literal(`'${JSON.stringify(voteJson)}'`)
      ),
    },
    { where: { id: id } },
  )
}

function binaryInsert(arr, val) {
  console.log("Binary insert")
  console.log(`Inserting ${val} into ${arr}`)
  if (arr.length <= 1) {
    if (arr.length === 0) {
      arr.push(val)
    } else if (arr.length === 1) {
      if (arr[0] < val) {
        arr.push(val)
      } else {
        arr.splice(0, 0, val)
      }
    }
    return arr
  }

  let low = 0
  let high = arr.length - 1
  let mid = Math.floor((high + low) / 2)
  let count = 0
  while (high !== mid && low !== mid) {
    count += 1
    if (count === 10) {
      break
    }

    if (val > arr[mid]) {
      low = mid
    } else {
      high = mid
    }
    mid = Math.floor((high + low) / 2)
  }
  
  if (val < arr[low]) {
    arr.splice(low, 0, val)
  } else if (val < arr[high]) {
    arr.splice(high, 0, val)
  } else {
    if (high + 1 === arr.length) {
      arr.push(val)
    } else {
      arr.splice(high + 1, 0, val)
    }
  }
  console.log(`Result: ${arr}`)
  return arr
}

exports.likePost = async(req, res, next) => {
  try {
    console.log("POST /post/:id/likePost/:userId")
    id = req.params.id
    userId = req.params.userId
    const findPost = await Posts.findOne({
      where: {
        id: id
      }
    })

    const findUser = await Posts.findOne({
      where: {
        userId: userId
      }
    })
    if (findUser) {
      console.log("User already liked the post")
      throw new Error("User already liked the post")
    }

    let voteJson = findPost.votes
    binaryInsert(voteJson["likes"], userId)

    await updateVotes(id, voteJson)
    res.send(voteJson)
  } catch (err) {
    next(err)
  }
}
