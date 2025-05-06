import { useState, useEffect, useRef } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import PostLikeSection from "./PostLikeSection.jsx"
import { api } from '../api/api.js'

function PostFeed() {
  const[listOfPosts, setListOfPosts] = useState([])
  const navigate = useNavigate()

  const location = useLocation()
  const { userPosts, userLikedPosts, userComments } = location.state || {}

  console.log(`userPosts: ${JSON.stringify(userPosts)}`)
  console.log(`userLikedPosts: ${JSON.stringify(userLikedPosts)}`)
  console.log(`userComments: ${JSON.stringify(userComments)}`)

  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await api.get("/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        let res
        if (userPosts) {
          res = await api.get(`/profile/viewUserPosts/${userPosts["username"]}`)
        } else if (userLikedPosts) {
          res = await api.get(`/profile/viewUserLikedPosts/${userLikedPosts["username"]}`)
        } else if (userComments) {
          res = await api.get(`/profile/viewUserCommentedPosts/${userComments["username"]}`)
        } else {
          res = await api.get("/home/browse")
        }
        setListOfPosts(res.data)
      } else {
        console.log("User not authenticated");
        navigate('/auth/directLogin', { state: { pageName: '/home/browse' } })
      }
    }
    conditionalRender()
  }, [navigate])

  useEffect(() => {
    console.log(listOfPosts)
  }, [listOfPosts])

  // keep track of number of refreshes
  const renderCount = useRef(1)
  useEffect(() => {
    renderCount.current += 1
  })

  return (
    <>
      <p>{renderCount.current}</p>
      {listOfPosts.map((post, key) => (
        <div className="post" key={key}>
          <p>Title: {post.postTitle}</p>
          <p>Body: {post.postBody}</p>
          <p>Created by user: {post.userId}</p>
          <p>Time of creation: {post.createdAt}</p>
          <PostLikeSection postId={post.id}></PostLikeSection>
        </div>
      ))}
    </>
  )
}

export default PostFeed
