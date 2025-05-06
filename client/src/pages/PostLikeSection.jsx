import { memo, useEffect } from 'react'
import "./PostLikeSection.css"
import axios from "axios"
import UseLoading from "../custom_hooks/UseLoading"

function PostLikeSection({ postId }) {

  useEffect(() => {
    async function fetchLikes() {
      await axios.get(`http://localhost:3000/profile/viewUserPosts/${userPosts["username"]}`)
    }
  }, [])
  
  function likePost() {
    
  }

  console.log("Post Id printed @ PostLikeSection: " + postId)
  return (
    <>
      <div className="my_border">
        <p>{postId}</p>
        <button onClick={() => likePost()}>Like</button>
      </div>
    </>
  )
}

export default memo(PostLikeSection)
