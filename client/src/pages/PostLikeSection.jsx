import { memo, useEffect, useState } from 'react'
import "./PostLikeSection.css"
import useLoading from "../custom_hooks/useLoading"
import { api } from '../api/api.js'

function PostLikeSection({ postId }) {
  const[likes, setLikes] = useState([])
  const[didLike, setDidLike] = useState()

  useEffect(() => {
    async function fetchLikes() {
      let res = await api.get(`/post/${postId}/getLikes`)
      console.log(res.data)
      setLikes(res.data)

      let res_1 = await api.get(`/post/${postId}/didUserLikePost`)
      let didUserLikePost = res_1.data
      console.log(didUserLikePost)
      if (didUserLikePost) {
        setDidLike(true)
      } else {
        setDidLike(false)
      }
    }
    fetchLikes()
  }, [])

  useEffect(() => {
    console.log(likes)
  }, [likes])
  
  async function likePost() {
    if (didLike) {
      let res = await api.post(`/post/${postId}/unlikePost`)
      console.log(res.data)
      setDidLike(false)
    } else {
      let res = await api.post(`/post/${postId}/likePost`)
      console.log(res.data)
      setDidLike(true)
    }
  }

  console.log("Post Id printed @ PostLikeSection: " + postId)
  return (
    <div className="my_border">
      {likes.length === 0 && <p> No likes </p>}
      {likes.length > 0 && <p>{likes.length} Likes</p>}
      {!didLike && <button onClick={() => likePost()}>Like post</button>}
      {didLike && <button onClick={() => likePost()}>Unlike post</button>}
    </div>
  )
}

export default memo(PostLikeSection)
