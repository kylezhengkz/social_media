import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./SearchUser.css"

function SearchUser() {
  const[usernameNotFound, setUsernameNotFound] = useState(true)
  const[userPosts, setUserPosts] = useState([])
  const[likedPosts, setLikedPosts] = useState([])
  const[userComments, setUserComments] = useState([])
  const[username, setUsername] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        
      } else {
        console.log("User not authenticated");
        navigate('/auth/directLogin', { state: { pageName: '/home' } })
      }
    }
    conditionalRender()
  }, [navigate])

  var myTimeout
  async function searchUsername(username) {
    if (!username) {
      console.log("Bruh")
      setUsernameNotFound(true)
      return
    }
    console.log(`Searching username ${username}`)
    let findUsername = await axios.get(`http://localhost:3000/profile/queryProfile/${username}`)
    if (findUsername.data.error) {
      console.log("Username not found")
      setUsernameNotFound(true)
      return
    } else {
      setUsernameNotFound(false)
      setUserPosts(findUsername.data["posts"])
      setLikedPosts(findUsername.data["likedPosts"])
      setUserComments(findUsername.data["comments"])
      setUsername(username)
    }
    console.log(`Result: ${JSON.stringify(findUsername.data)}`)
  }

  function browseUserPosts() {
    navigate(`/home/browse/${username}`, { state: { "userPosts": {"username": username}} })
  }

  function browseUserLikedPosts() {
    navigate(`/home/browse/${username}`, { state: { "userLikedPosts": {"username": username}} })
  }

  function browseUserCommentedPosts() {
    navigate(`/home/browse/${username}`, { state: { "userComments": {"username": username}} })
  }

  return (
    <>
      <h1>Search User</h1>
      <input placeholder="Enter username" type="text" maxLength="30" onChange={(e) => {
        clearTimeout(myTimeout)
        myTimeout = setTimeout(() => searchUsername(e.target.value), 400)
      }}/>

      {usernameNotFound && <p>Username not found</p>}

      {!usernameNotFound &&
        <>
          <h1>{username}'s Profile</h1>
          <div className="flex-container">
            <h1>Posts</h1>
            <button onClick={browseUserPosts}>Browse</button>
          </div>
          <div>
            {userPosts.map((value, key) => {
              return <li key={key}>{JSON.stringify(value)}</li>
            })}
          </div>

          <div className="flex-container">
            <h1>Liked Posts</h1>
            <button onClick={browseUserLikedPosts}>Browse</button>
          </div>
          <div>
            {likedPosts.map((value, key) => {
              return <li key={key}>{JSON.stringify(value)}</li>
            })}
          </div>

          <div className="flex-container">
            <h1>Comments</h1>
            <button onClick={browseUserCommentedPosts}>Browse</button>
          </div>
          <div>
            {userComments.map((value, key) => {
              return <li key={key}>{JSON.stringify(value)}</li>
            })}
          </div>
        </>
      }
    </>
  )
}

export default SearchUser
