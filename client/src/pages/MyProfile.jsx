import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./MyProfile.css"

function MyProfile() {
  const [myPosts, setMyPosts] = useState([])
  const [postsILiked, setPostsILiked] = useState([])
  const [myComments, setMyComments] = useState([])
  const navigate = useNavigate()
  const [editPost, setEditPost] = useState(-1)
  const pendingTitle = useRef("")
  const pendingBody = useRef("")  

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
  }, [myPosts])

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

  function deletePost(postId) {
    console.log(postId)
  }

  return (
    <>
      <h1>My Profile</h1>

      <h1>Posts</h1>
      <div>
        {myPosts.map((value, key) => {
          // userContribution is meant to be the umbrella term for post, like and comment
          return (<div key={key}>
            <li key={key}>{JSON.stringify(value)}</li>
            <button type="button" onClick={() => editPostAction(value.id, value.postTitle, value.postBody)}>Edit</button>
            <button type="button" onClick={() => deletePost(value.id)}>Delete</button>
            
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
          </div>)
        })}
      </div>

      <h1>Posts You've Liked</h1>
      <div>
        {postsILiked.map((value, key) => {
          return <li key={key}>{JSON.stringify(value)}</li>
        })}
      </div>

      <h1>Comments</h1>
      <div>
        {myComments.map((value, key) => {
          return <li key={key}>{JSON.stringify(value)}</li>
        })}
      </div>
    </>
  )
}

export default MyProfile
