import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function MyProfile() {
  const[myPosts, setMyPosts] = useState([])
  const[postsILiked, setPostsILiked] = useState([])
  const[myComments, setMyComments] = useState([])
  const navigate = useNavigate()

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
  return (
    <>
      <h1>My Profile</h1>

      <h1>Posts</h1>
      <div>
        {myPosts.map((value, key) => {
          return <li key={key}>{JSON.stringify(value)}</li>
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
