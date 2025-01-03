import { useState, useEffect } from 'react'
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
    console.log(`Like post with id ${postId}`)
  }

  const unlikePost = async (postId) => {
    await axios.post(`http://localhost:3000/post/${postId}/unlikePost`)
    setLikeStatuses({
      ...likeStatuses,
      [postId]: false
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
    console.log(listOfPosts)
    let likeStatusesJson = {}
    for (const post of listOfPosts) {
      console.log(post.id)
      likeStatusesJson[post.id] = false
    }
    setLikeStatuses(likeStatusesJson)
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
