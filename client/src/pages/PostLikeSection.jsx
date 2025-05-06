import { memo, useEffect, useState } from 'react'
import "./PostLikeSection.css"
import UseLoading from "../custom_hooks/UseLoading"
import { api } from '../api/api.js'

function PostLikeSection({ postId }) {
  const[likes, setLikes] = useState([])
  const[toggleLike, setToggleLike] = useState(false)

  useEffect(() => {
    async function fetchLikes() {
      let res = await api.get(`/post/${postId}/getLikes`)
      console.log(res.data)
      setLikes(res.data)
    }
    fetchLikes()
  }, [])

  useEffect(() => {
    console.log(likes)
  }, [likes])
  
  function likePost() {
    if (toggleLike) {
      setToggleLike(false)
    } else {
      setToggleLike(true)
    }
  }

  console.log("Post Id printed @ PostLikeSection: " + postId)
  return (
    <div className="my_border">
      {likes.length === 0 && <p> No likes </p>}
      {likes.length > 0 && <p>{likes.length} Likes</p>}
      {!toggleLike && <button onClick={() => likePost()}>Like post</button>}
      {toggleLike && <button onClick={() => likePost()}>Unlike post</button>}
    </div>
  )
}

export default memo(PostLikeSection)
