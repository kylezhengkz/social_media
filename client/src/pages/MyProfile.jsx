import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./MyProfile.css"
import useLoading from "../custom_hooks/useLoading"

function MyProfile() {

  // store user's posts, likes, comments
  const [myPosts, setMyPosts] = useState([])
  const [postsILiked, setPostsILiked] = useState([])
  const [myComments, setMyComments] = useState([])

  const [likeStatuses, setLikeStatuses] = useState({}) // toggle like/unlike display when user unlikes/relikes a post
  const [editPost, setEditPost] = useState(-1) // if user wants to edit a post, sets to post id
  const [deletePostStatus, setDeletePostStatus] = useState(-1) // if user wants to delete a post, sets to post id

  const { isLoading, beginLoading, finishLoading } = useLoading() // custom hook

  useEffect(() => {
    console.log("STATUS: " + JSON.stringify(isLoading))
  }, [isLoading])

  // stores pending edits of post before submitting changes
  const pendingTitle = useRef("")
  const pendingBody = useRef("")

  const navigate = useNavigate()

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

  return (
    <>
      <h1>My Profile</h1>

      <h1>Posts</h1>
      <div>
        {myPosts.map((value, key) => {
          return (<div key={key}>
            <li key={key}>{JSON.stringify(value)}</li>
            <button type="button" onClick={() => {
              // edit post
              console.log(value.id)
              console.log(value.postTitle)
              console.log(value.postBody)
              setEditPost(value.id)
              pendingTitle.current = value.postTitle
              pendingBody.current = value.postBody
            }}>Edit</button>

            <button type="button" onClick={() => {
              console.log(value.id)
              if (deletePostStatus === value.id) {
                setDeletePostStatus(-1)
              } else {
                setDeletePostStatus(value.id)
              }
            }}>Delete</button>
            
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
                  <button type="button" onClick={() => {
                    setEditPost(-1)
                  }}>Cancel edit</button>
              </div>
            }

            {deletePostStatus === value.id &&
              <div id="deletePost">
                <p>Are you sure you want to delete post titled {value.postTitle}?</p>
                <button disabled={isLoading[value.id]} onClick={async () => {
                  beginLoading(value.id) // disables button to avoid race condition where user clicks rapidly multiple times sending new requests when previous didn't finish yet
                  await axios.post(`http://localhost:3000/post/delete/${value.id}`)

                  // remove post, and potentially likes/comments associated to that post
                  console.log(myPosts)
                  setMyPosts(prev => prev.filter(post => post.id !== value.id))
                  setPostsILiked(prev => prev.filter(likedPost => likedPost.postId !== value.id))
                  setMyComments(prev => prev.filter(comment => postId.id !== value.id))
                  toggleDeletePost(value.id)
                  finishLoading(value.id)
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
                <button type="button" disabled={isLoading[value.postId]} onClick={async () => {
                  beginLoading(value.postId)
                  await axios.post(`http://localhost:3000/post/${value.postId}/unlikePost`)
                  setLikeStatuses({
                    ...likeStatuses,
                    [value.id]: false
                  })
                  finishLoading(value.postId)
                }
                }>Unlike</button>
              }
              {!likeStatuses[value.id] && 
                <button type="button" disabled={isLoading[value.postId]} onClick={async () => {
                  beginLoading(value.postId)
                  console.log(isLoading[value.postId])
                  await axios.post(`http://localhost:3000/post/${value.postId}/likePost`)
                  setLikeStatuses({
                    ...likeStatuses,
                    [value.id]: true
                  })
                  finishLoading(value.postId)
                  console.log(isLoading[value.postId])
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
