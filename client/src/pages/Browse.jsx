import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function Browse() {
  const[listOfPosts, setListOfPosts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        axios.get("http://localhost:3000/home/browse").then((res) => {
          setListOfPosts(res.data)
        })
      } else {
        console.log("User not authenticated");
        navigate('/auth/directLogin', { state: { pageName: '/home/browse' } })
      }
    }
    conditionalRender()
  }, [navigate])
  return (
    <>
      <h1>Browse</h1>
      <div>
        {listOfPosts.map((value, key) => {
          return <li key={key}>{JSON.stringify(value)}</li>
        })}
      </div>
    </>
  )
}

export default Browse
