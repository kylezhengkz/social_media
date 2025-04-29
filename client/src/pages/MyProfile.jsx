import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./MyProfile.css"

function MyProfile() {
  const [myPosts, setMyPosts] = useState([])
  const [postsILiked, setPostsILiked] = useState([])
  const [likeStatuses, setLikeStatuses] = useState([])
  const [myComments, setMyComments] = useState([])
  const navigate = useNavigate()
  const [editPost, setEditPost] = useState(-1)
  const pendingTitle = useRef("")
  const pendingBody = useRef("")  
  const [deletePostStatus, setDeletePostStatus] = useState(-1)

  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        const [postsJson, likedPosts, commentsJson] = await Promise.all([
          axios.get("http://localhost:3000/profile/viewMyPosts"),
          axios.get("http://localhost:3000/profile/viewPostsILiked"),
          axios.get("http://localhost:3000/profile/viewMyComments")
        ])
        setMyPosts(postsJson.data)
        setPostsILiked(likedPosts.data)
        setMyComments(commentsJson.data)
      } else {
        console.log("User not authenticated");
        navigate('/auth/directLogin', { state: { pageName: '/home' } })
      }
    }
    conditionalRender()
  }, [navigate])

  useEffect(() => {
    console.log(myPosts)
    console.log(postsILiked)
    console.log(myComments)
    
    let likeStatusesJson = {}
    for (const postILiked of postsILiked) {
      likeStatusesJson[postILiked.id] = true
    }
    setLikeStatuses(likeStatusesJson)
  }, [myPosts])

  // just printing
  useEffect(() => {
    console.log(likeStatuses)
  }, [likeStatuses])

  function editPostAction(postId, postTitle, postBody) {
    console.log(postId)
    console.log(postTitle)
    console.log(postBody)
    setEditPost(postId)
    pendingTitle.current = postTitle
    pendingBody.current = postBody
  }

  function cancelEdit() {
    setEditPost(-1)
  }

  function toggleDeletePost(postId) {
    console.log(postId)
    if (deletePostStatus === postId) {
      setDeletePostStatus(-1)
    } else {
      setDeletePostStatus(postId)
    }
  }

  return (
    <>
      <h1>My Profile</h1>

      <h1>Posts</h1>
      <div>
        {myPosts.map((value, key) => {
          return (<div key={key}>
            <li key={key}>{JSON.stringify(value)}</li>
            <button type="button" onClick={() => editPostAction(value.id, value.postTitle, value.postBody)}>Edit</button>
            <button type="button" onClick={() => toggleDeletePost(value.id)}>Delete</button>
            
            {editPost === value.id &&
              <div id="editPost">
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    const newTitle = pendingTitle.current
                    const newBody = pendingBody.current
                    console.log(value.id)
                    console.log(newTitle)
                    console.log(newBody)
                    await axios.post(`http://localhost:3000/post/edit/${value.id}`, {"newTitle":newTitle, "newBody":newBody})
                    setEditPost(-1)
                    setMyPosts(
                      myPosts.map(post =>
                        post.id === value.id
                          ? {...post, "postTitle":newTitle, "postBody":newBody}
                          : post
                      )
                    )
                  }}>
                    <>
                      <input placeholder="Title" type="text" maxLength="100" defaultValue={value.postTitle} onChange={(e) => {
                        pendingTitle.current = e.target.value
                      }}/>
                      <input placeholder="Body" type="text" maxLength="2200" defaultValue={value.postBody} onChange={(e) => {
                        pendingBody.current = e.target.value
                      }}/>
                      <button type="submit">Submit</button>
                    </>
                  </form>
                  <button type="button" onClick={() => cancelEdit(value.id)}>Cancel edit</button>
              </div>
            }

            {deletePostStatus === value.id &&
              <div id="deletePost">
                <p>Are you sure you want to delete post titled {value.postTitle}?</p>
                <button onClick={async () => {
                  await axios.post(`http://localhost:3000/post/delete/${value.id}`)
                  // need to remove all posts from state, including your likes and comments to that post
                  let newPosts = []
                  console.log(myPosts)
                  for (const post of myPosts) {
                    if (post.id !== value.id) {
                      newPosts.push(post)
                    }
                  }
                  setMyPosts(newPosts)
                  let newPostsILiked = []
                  for (const likedPost of postsILiked) {
                    if (likedPost.postId !== value.id) {
                      newPostsILiked.push(likedPost)
                    }
                  }
                  setPostsILiked(newPostsILiked)
                  let newComments = []
                  for (const comment of myComments) {
                    if (comment.postId !== value.id) {
                      newComments.push(comment)
                    }
                  }
                  setMyComments(newComments)
                  toggleDeletePost(value.id)
                }}>Yes</button>
                <button onClick={() => toggleDeletePost(value.id)}>No</button>
              </div>
            }

          </div>)
        })}
      </div>

      <h1>Posts You've Liked</h1>
      <div>
        {postsILiked.map((value, key) => {
          return <div key={key}>
              <li key={key}>{JSON.stringify(value)}</li>
              {likeStatuses[value.id] && 
                <button type="button" onClick={async () => {
                  await axios.post(`http://localhost:3000/post/${value.postId}/unlikePost`)
                  setLikeStatuses({
                    ...likeStatuses,
                    [value.id]: false
                  })
                }
                }>Unlike</button>
              }
              {!likeStatuses[value.id] && 
                <button type="button" onClick={async () => {
                  await axios.post(`http://localhost:3000/post/${value.postId}/likePost`)
                  setLikeStatuses({
                    ...likeStatuses,
                    [value.id]: true
                  })
                }
                }>Like</button>
              }
            </div>
        })}
      </div>

      <h1>Comments</h1>
      <div>
        {myComments.map((value, key) => {
          return <div key={key}>
            <li key={key}>{JSON.stringify(value)}</li>
            <button type="button" onClick={() => editPostAction(value.id, value.postTitle, value.postBody)}>Edit</button>
            <button type="button" onClick={() => toggleDeletePost(value.id)}>Delete</button>
           </div>
        })}
      </div>
    </>
  )
}

export default MyProfile
