import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./Browse.css"
import { useLocation } from 'react-router-dom'

function Browse() {
  const[listOfPosts, setListOfPosts] = useState([])
  const[comments, setComments] = useState({}) // map postId to comments
  const[likers, setLikers] = useState({}) // map postId to likers

  const[likeStatuses, setLikeStatuses] = useState({})
  const[commentStatuses, setCommentStatuses] = useState({})
  const pendingComments = useRef({})
  const[viewCommentStatuses, setViewCommentStatuses] = useState({})
  const[viewLikerStatuses, setViewLikerStatuses] = useState({})
  const[likeCounts, setLikeCounts] = useState({})
  const[commentCounts, setCommentCounts] = useState({})
  const[userCommentsState, setUserComments] = useState({})
  const navigate = useNavigate()

  const location = useLocation()
  const { userPosts, userLikedPosts, userComments } = location.state || {}

  console.log(`userPosts: ${JSON.stringify(userPosts)}`)
  console.log(`userLikedPosts: ${JSON.stringify(userLikedPosts)}`)
  console.log(`userComments: ${JSON.stringify(userComments)}`)

  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        if (userPosts) {
          await axios.get(`http://localhost:3000/profile/viewUserPosts/${userPosts["username"]}`).then((res) => {
            setListOfPosts(res.data)
          })
        } else if (userLikedPosts) {
          await axios.get(`http://localhost:3000/profile/viewUserLikedPosts/${userLikedPosts["username"]}`).then((res) => {
            console.log(res.data)
            setListOfPosts(res.data)
          })
        } else if (userComments) {
          await axios.get(`http://localhost:3000/profile/viewUserCommentedPosts/${userComments["username"]}`).then((res) => {
            setListOfPosts(res.data)
          })
        } else {
          await axios.get("http://localhost:3000/home/browse").then((res) => {
            setListOfPosts(res.data)
          })
        }
      } else {
        console.log("User not authenticated");
        navigate('/auth/directLogin', { state: { pageName: '/home/browse' } })
      }
    }
    conditionalRender()
  }, [navigate])

  useEffect(() => {
    async function setInitialLike() {
      console.log(listOfPosts)
      let likeStatusesJson = {}
      let commentStatusesJson = {}
      let viewCommentStatusesJson = {}
      let viewLikerStatusesJson = {}
      let likeCountsJson = {}
      let commentCountsJson = {}
      let userCommentsJson = {}
      for (const post of listOfPosts) {
        const didUserLikePost = await axios.get(`http://localhost:3000/post/${post.id}/didUserLikePost`)
        const likeCount = await axios.get(`http://localhost:3000/post/${post.id}/totalLikes`)
        const commentCount = await axios.get(`http://localhost:3000/post/${post.id}/totalComments`)
        if (userComments) {
          var getUserComments = await axios.get(`http://localhost:3000/post/${post.id}/getUserComments/${userComments["username"]}`)
          userCommentsJson[post.id] = getUserComments.data
          setUserComments(userCommentsJson)
        }
        likeStatusesJson[post.id] = didUserLikePost.data
        commentStatusesJson[post.id] = false
        viewCommentStatusesJson[post.id] = false
        viewLikerStatusesJson[post.id] = false
        likeCountsJson[post.id] = likeCount.data
        commentCountsJson[post.id] = commentCount.data
      }
      setLikeStatuses(likeStatusesJson)
      setCommentStatuses(commentStatusesJson)
      setViewCommentStatuses(viewCommentStatusesJson)
      setViewLikerStatuses(viewLikerStatusesJson)
      setLikeCounts(likeCountsJson)
      setCommentCounts(commentCountsJson)
    }
    setInitialLike()
  }, [listOfPosts])

  // just printing
  useEffect(() => {
    console.log(likeStatuses)
  }, [likeStatuses])

  const toggleCommentForm = (postId) => {
    if (commentStatuses[postId]) {
      console.log(`Close comment form for post id ${postId}`)
      setCommentStatuses(prev => ({...prev, [postId]: false}))
      return
    }
    console.log(`Open comment form for post id ${postId}`)
    setCommentStatuses(prev => ({...prev, [postId]: true}))
  }

  const likePost = async (postId) => {
    await axios.post(`http://localhost:3000/post/${postId}/likePost`)
    setLikeStatuses(prev => ({...prev, [postId]: true}))
    setLikeCounts(prev => ({...prev, [postId]: likeCounts[postId] + 1}))
    console.log(`Like post with id ${postId}`)
  }

  const unlikePost = async (postId) => {
    await axios.post(`http://localhost:3000/post/${postId}/unlikePost`)
    setLikeStatuses(prev => ({...prev, [postId]: false}))
    setLikeCounts(prev => ({...prev, [postId]: likeCounts[postId] - 1}))
    console.log(`Unlike post with id ${postId}`)
  }

  const toggleViewComments = async (postId) => {
    if (viewCommentStatuses[postId]) {
      console.log(`Close comment form for post id ${postId}`)
      setViewCommentStatuses(prev => ({...prev, [postId]: false}))
      return
    }
    console.log(`Open comment form for post id ${postId}`)
    const res = await axios.get(`http://localhost:3000/post/${postId}/getComments`)
    console.log(`Setting comments: ${JSON.stringify(res.data)}`)
    setComments(prev => ({...prev, [postId]: res.data}))
    setViewCommentStatuses({
      ...viewCommentStatuses,
      [postId]: true
    })
  }

  const toggleViewLikers = async (postId) => {
    if (viewLikerStatuses[postId]) {
      console.log(`Close likes view for post id ${postId}`)
      setViewLikerStatuses({
        ...viewLikerStatuses,
        [postId]: false
      })
      return
    }
    console.log(`Open likes view for post id ${postId}`)
    await axios.get(`http://localhost:3000/post/${postId}/getLikes`).then((res) => {
      console.log(`Setting likers: ${JSON.stringify(res.data)}`)
      setLikers({
        ...likers,
        [postId]: res.data
      })
      console.log(postId)
      console.log(`See likers: ${JSON.stringify(likers[postId])}`)
    })
    setViewLikerStatuses({
      ...viewLikerStatuses,
      [postId]: true
    })
  }

  const renderCount = useRef(1)
  useEffect(() => {
    renderCount.current += 1
  })

  return (
    <>
      <p>{renderCount.current}</p>
      {userPosts && <h1>{userPosts["username"]}'s Posts </h1>}
      {userLikedPosts && <h1>Posts Liked By {userLikedPosts["username"]} </h1>}
      {userComments && <h1>{userComments["username"]} Commented in these Posts </h1>}
      {!userPosts && !userLikedPosts && !userComments && <h1>Browse</h1>}
      <div>
        {listOfPosts.map((value) => {
          return (
            <div className="post" key={value.id}>
              <li>{JSON.stringify(value)}</li>

              {!viewLikerStatuses[value.id] && <button type="button" onClick={() => toggleViewLikers(value.id)}>See {likeCounts[value.id] && likeCounts[value.id]} users who liked the post</button>}
              {viewLikerStatuses[value.id] && <button type="button" onClick={() => toggleViewLikers(value.id)}>Hide users</button>}

              {viewLikerStatuses[value.id] && likers[value.id] && 
                likers[value.id].map((liker, key) => {
                  return <p key={key}>{JSON.stringify(liker)}</p>
                })
              }

              <br></br>

              {!likeStatuses[value.id] && <button type="button" onClick={() => likePost(value.id)}>Like</button>}
              {likeStatuses[value.id] && <button type="button" onClick={() => unlikePost(value.id)}>Unlike</button>}
              
              {!commentStatuses[value.id] && <button type="button" onClick={() => toggleCommentForm(value.id)}>Add a comment</button>}
              {commentStatuses[value.id] && <button type="button" onClick={() => toggleCommentForm(value.id)}>Cancel comment</button>}

              <form onSubmit={(e) => {
                e.preventDefault()
                const element = document.getElementById(value.id)
                console.log(element.value)
                axios.post(`http://localhost:3000/post/${value.id}/addComment`, {"comment":element.value})
                setCommentStatuses({
                  ...commentStatuses,
                  [value.id]: false
                })
                console.log(typeof(commentCounts[value.id].data))
                console.log(`See: ${commentCounts[value.id].data}`)
                setCommentCounts({
                  ...commentCounts,
                  [value.id]: commentCounts[value.id] + 1
                })
              }}>
                {commentStatuses[value.id] &&
                  <input placeholder="Add a comment" type="text" id={value.id} maxLength="2200" onChange={(e) => {
                    console.log(e.target.value)
                    console.log(value.id)
                    pendingComments.current = {
                      ...pendingComments.current,
                      [value.id]:e.target.value
                    }
                    console.log(pendingComments.current)
                  }}/>
                }
                {commentStatuses[value.id] &&  <input type="submit"/>}
              </form>
              
              {!viewCommentStatuses[value.id] && <button type="button" onClick={() => toggleViewComments(value.id)}>View {commentCounts[value.id] && commentCounts[value.id]} comments</button>}
              {viewCommentStatuses[value.id] && <button type="button" onClick={() => toggleViewComments(value.id)}>Hide comments</button>}
              
              {userComments && !viewCommentStatuses[value.id] && userCommentsState[value.id] &&
                userCommentsState[value.id].map((comment, key) => {
                  return <p key={key}>{JSON.stringify(comment)}</p>
                })
              }

              {viewCommentStatuses[value.id] && comments[value.id] && 
                comments[value.id].map((comment, key) => {
                  return <p key={key}>{JSON.stringify(comment)}</p>
                })
              }
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Browse
