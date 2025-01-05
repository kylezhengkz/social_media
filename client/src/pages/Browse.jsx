import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./Browse.css"

function Browse() {
  const[listOfPosts, setListOfPosts] = useState([])
  const[likeStatuses, setLikeStatuses] = useState({})
  const[commentStatuses, setCommentStatuses] = useState({})
  const pendingComments = useRef({})
  const[viewCommentStatuses, setViewCommentStatuses] = useState({})
  const[comments, setComments] = useState({})
  const navigate = useNavigate()

  const likePost = async (postId) => {
    await axios.post(`http://localhost:3000/post/${postId}/likePost`)
    setLikeStatuses({
      ...likeStatuses,
      [postId]: true
    })
    axios.get("http://localhost:3000/home/browse").then(async (res) => {
      setListOfPosts(res.data)
    })
    console.log(`Like post with id ${postId}`)
  }

  const unlikePost = async (postId) => {-
    await axios.post(`http://localhost:3000/post/${postId}/unlikePost`)
    setLikeStatuses({
      ...likeStatuses,
      [postId]: false
    })
    axios.get("http://localhost:3000/home/browse").then(async (res) => {
      setListOfPosts(res.data)
    })
    console.log(`Unlike post with id ${postId}`)
  }

  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        axios.get("http://localhost:3000/home/browse").then(async (res) => {
          setListOfPosts(res.data)
        })
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
      for (const post of listOfPosts) {
        const didUserLikePost = await axios.get(`http://localhost:3000/post/${post.id}/didUserLikePost`)
        likeStatusesJson[post.id] = didUserLikePost.data
        commentStatusesJson[post.id] = false
        viewCommentStatusesJson[post.id] = false
        console.log(post.id)
        console.log(didUserLikePost.data)
      }
      setLikeStatuses(likeStatusesJson)
      setCommentStatuses(commentStatusesJson)
      setViewCommentStatuses(viewCommentStatusesJson)
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
      setCommentStatuses({
        ...commentStatuses,
        [postId]: false
      })
      return
    }
    console.log(`Open comment form for post id ${postId}`)
    setCommentStatuses({
      ...commentStatuses,
      [postId]: true
    })
  }

  const toggleViewComments = async (postId) => {
    if (viewCommentStatuses[postId]) {
      console.log(`Close comment form for post id ${postId}`)
      setViewCommentStatuses({
        ...viewCommentStatuses,
        [postId]: false
      })

      axios.get(`http://localhost:3000/post/${postId}/getComments`).then(async (res) => {
        setComments({
          ...comments,
          [postId]: res.data
        })
      })
      return
    }
    console.log(`Open comment form for post id ${postId}`)
    setViewCommentStatuses({
      ...viewCommentStatuses,
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
      <h1>Browse</h1>
      <div>
        {listOfPosts.map((value) => {
          return (
            <div className="post" key={value.id}>
              <li>{JSON.stringify(value)}</li>
              {!likeStatuses[value.id] && <button type="button" onClick={() => likePost(value.id)}>Like</button>}
              {likeStatuses[value.id] && <button type="button" onClick={() => unlikePost(value.id)}>Unlike</button>}
              
              {!commentStatuses[value.id] && <button type="button" onClick={() => toggleCommentForm(value.id)}>Add a comment</button>}
              {commentStatuses[value.id] && <button type="button" onClick={() => toggleCommentForm(value.id)}>Cancel comment</button>}

              <form onSubmit={(e) => {
                const element = document.getElementById(value.id)
                console.log(element.value)
                axios.post(`http://localhost:3000/post/${value.id}/addComment`, {"comment":element.value})
                // axios.post(`http://localhost:3000/post/${newComment.postId}/addComment`, newComment).then(() =>
                //   axios.get("http://localhost:3000/home/browse").then(async (res) => {
                //     setListOfPosts(res.data)
                //   })
                // )
                e.preventDefault()
              }}>
                {commentStatuses[value.id] &&
                  <input placeholder="Add a comment" type="text" id={value.id} onChange={(e) => {
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

              {!viewCommentStatuses[value.id] && <button type="button" onClick={() => toggleViewComments(value.id)}>View comments</button>}
              {viewCommentStatuses[value.id] && <button type="button" onClick={() => toggleViewComments(value.id)}>Hide comments</button>}
              
              {viewCommentStatuses[value.id] &&
                <ul>
                  <li>Apple</li>
                  <li>Apple</li>
                  <li>Apple</li>
                </ul>
              }
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Browse
