import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import "./Browse.css"

function Browse() {
  const[listOfPosts, setListOfPosts] = useState([])
  const[likeStatuses, setLikeStatuses] = useState({})
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
      for (const post of listOfPosts) {
        const didUserLikePost = await axios.get(`http://localhost:3000/post/${post.id}/didUserLikePost`)
        likeStatusesJson[post.id] = didUserLikePost.data
        console.log(post.id)
        console.log(didUserLikePost.data)
      }
      setLikeStatuses(likeStatusesJson)
    }
    setInitialLike()
  }, [listOfPosts])

  // just printing
  useEffect(() => {
    console.log(likeStatuses)
  }, [likeStatuses])

  return (
    <>
      <h1>Browse</h1>
      <div>
        {listOfPosts.map((value) => {
          return (
            <div className="post" key={value.id}>
              <li>{JSON.stringify(value)}</li>
              {!likeStatuses[value.id] && <button type="button" onClick={() => likePost(value.id)}>Like</button>}
              {likeStatuses[value.id] && <button type="button" onClick={() => unlikePost(value.id)}>Unlike</button>}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Browse
