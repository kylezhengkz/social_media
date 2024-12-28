import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from 'react-router-dom'

function Home() {
  const[listOfUsers, setListOfUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function conditionalRender() {
      let checkAuth = await axios.get("http://localhost:3000/auth/checkAuth")

      if (checkAuth.data.isAuth) {
        axios.get("http://localhost:3000/auth/register").then((res) => {
          setListOfUsers(res.data)
        })
      } else {
        console.log("User not authenticated");
        navigate('/auth/directLogin', { state: { pageName: 'home' } })
      }
    }
    conditionalRender()
  }, [navigate])
  return (
    <>
      <h1>Home</h1>
      <div>
        {listOfUsers.map((value, key) => {
          return <li key={key}>{JSON.stringify(value)}</li>
        })}
      </div>
    </>
  )
}

export default Home
