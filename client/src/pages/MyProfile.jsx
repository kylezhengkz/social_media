import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./MyProfile.css"

function MyProfile() {
  const [myPosts, setMyPosts] = useState([])
  const [postsILiked, setPostsILiked] = useState([])
  const [myComments, setMyComments] = useState([])
  const navigate = useNavigate()
  const [myPostEditStatuses, setMyPostEditStatuses] = useState({})
  const pendingTitles = useRef({})
  const pendingBodies = useRef({})
  
  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        axios.get("http://localhost:3000/profile/viewMyPosts").then((res) => {
          setMyPosts(res.data)
        })
        axios.get("http://localhost:3000/profile/viewPostsILiked").then((res) => {
          setPostsILiked(res.data)
        })
        axios.get("http://localhost:3000/profile/viewMyComments").then((res) => {
          setMyComments(res.data)
        })
      } else {
        console.log("User not authenticated");
        navigate('/auth/directLogin', { state: { pageName: '/home' } })
      }
    }
    conditionalRender()
  }, [navigate])

  useEffect(() => {
    let myPostEditStatusesJson = {}
    let pendingTitlesJson = {}
    let pendingBodiesJson = {}
    for (const post of myPosts) {
      myPostEditStatusesJson[post.id] = false
      pendingTitlesJson.current[post.id] = post.postTitle
      pendingBodiesJson.current[post.id] = post.postBody
    }
    setMyPostEditStatuses(myPostEditStatusesJson)
    pendingTitles.current = pendingTitlesJson
    pendingBodies.current = pendingBodiesJson
  }, [])

  function toggleEdit(postId) {
    console.log(postId)
    if (myPostEditStatuses[postId]) {
      setMyPostEditStatuses({
        ...myPostEditStatuses,
        [postId]: false
      })
    } else {
      setMyPostEditStatuses({
        ...myPostEditStatuses,
        [postId]: true
      })
    }
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
          return (<div className="userContribution" key={key}>
            <li key={key}>{JSON.stringify(value)}</li>
            {!myPostEditStatuses[value.id] && 
              <>
                <button type="button" onClick={() => toggleEdit(value.id)}>Edit</button>
                <button type="button" onClick={() => deletePost(value.id)}>Delete</button>
              </>
            }
            {myPostEditStatuses[value.id] && 
              <>
                <button type="button" onClick={() => toggleEdit(value.id)}>Cancel edit</button>
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  const newTitle = pendingTitles.current[value.id]
                  const newBody = pendingBodies.current[value.id]
                  await axios.post(`http://localhost:3000/post/edit/${value.id}`, {"newTitle":newTitle, "newBody":newBody})
                  setMyPostEditStatuses({
                    ...myPostEditStatuses,
                    [value.id]: false
                  })
                  setMyPosts(
                    myPosts.map(post =>
                      post.id === value.id
                        ? {...post, "postTitle":newTitle, "postBody":newBody}
                        : post
                    )
                  )
                  pendingTitles.current[value.id] = newTitle
                  pendingBodies.current[value.id] = newBody
                }}>
                  {myPostEditStatuses[value.id] && 
                    <>
                      <input placeholder="Title" type="text" maxLength="100" defaultValue={value.postTitle} onChange={(e) => {
                        pendingTitles.current = {
                          ...pendingTitles.current,
                          [value.id]:e.target.value
                        }
                      }}/>
                      <input placeholder="Body" type="text" maxLength="2200" defaultValue={value.postBody} onChange={(e) => {
                        pendingBodies.current = {
                          ...pendingBodies.current,
                          [value.id]:e.target.value
                        }
                      }}/>
                      <button type="submit">Submit</button>
                    </>
                  }
                </form>
              </>
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
